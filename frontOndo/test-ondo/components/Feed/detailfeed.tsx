import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/module";
import { layoutAction } from "store/slice/layout";
import Reply from "components/Feed/reply";
import Router from "next/router";
import axios from "axios";

function makeArray(obj: any) {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const result = keys.map((item, idx) => {
    return {
      commentId: item,
      data: values[idx],
    };
  });

  return result.reverse();
}

function Detailfeed() {
  const dispatch = useDispatch();
  const layout = useSelector((state: RootState) => state.layout);
  const image = useSelector((state: RootState) => state.user.users.image);
  const detailData = useSelector((state: RootState) => state.layout.detailData);
  const likelist = useSelector((state: RootState) => state.layout.likelist);
  const feedssId = useSelector(
    (state: RootState) => state.layout.detailData.feed.feedId
  );
  const [comment, setComment] = useState(""); // 댓글작성
  const commentRef: any = useRef(null);
  const [commentData, setCommentData] = useState([]);
  const [likeCount, setLikeCount] = useState(detailData.feed.feedlike.length);
  // const session = useSelector((state)=>state.auth.session);
  // const image = useSelector(
  //   (state: RootState) => state.layout.detailData.feed.image
  // );
  console.log(detailData.feed.feedlike.length);
  console.log(detailData);
  console.log(commentData);
  console.log(feedssId);
  const likeFlag = detailData.likeflag;
  console.log(likeFlag);
  const startDate = detailData.feed.createdDate;
  const [putUser, SetPutUser] = useState([]);
  // putUser = detailData.comment;

  // const __getProfileImage = useCallback(() => {}, [userImage]);
  // console.log(startDate + "$$$$$$$$$$");
  const getStartDate = () => {
    const newdate = new Date(startDate);

    const sy = newdate.getFullYear();
    const sm = newdate.getMonth() + 1;
    const sd = newdate.getDate();

    return sy + "-" + sm + "-" + sd;
  };

  const oneDay: number = 1000 * 60 * 60 * 24;
  function makeTwoDigits(time: any) {
    return time.toString().length !== 2 ? `0${time}` : time;
  }
  const makeFeedTime = () => {
    const feedDate = new Date(startDate);
    const nowDate = Date.now(); //현재 시간

    const timeGap = nowDate - startDate;

    const date = parseInt(String(timeGap / oneDay));
    const hour = feedDate.getHours();
    const minutes = feedDate.getMinutes();
    // console.log(hour + "hour");
    // console.log(minutes);

    return ` ${hour > 12 ? "오후" : "오전"} ${
      hour > 12 ? makeTwoDigits(hour - 12) : makeTwoDigits(hour)
    }:${makeTwoDigits(minutes)},  ${
      date === 0 ? "오늘" : date === 1 ? "어제" : ``
      // `${date} 일전`
    }`;
  };

  const __loadComments = useCallback(() => {
    //코멘트 업로드 또는 불러올때 계속 새로고침
    if (detailData) {
      const token = localStorage.getItem("Token");
      dispatch(layoutAction.updateCommentTarget(feedssId));
      dispatch(layoutAction.updateIsCommentToFeed(true));
      // const feedsId = detailData.feed.feedId;
      axios({
        method: "GET",
        url: "http://localhost:8080" + "/comment/" + feedssId,
        // url: "http://localhost:8080" + "/feed",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log("######" + detailData.feed.feedId);
          // console.log(makeArray(res));
          // dispatch(layoutAction.updateDetailData(props.dto));
          // dispatch(layoutAction.updateDetailData(commentData));

          // setCommentData(makeArray(res.data));
          setCommentData(res.data.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const __uploadComment = useCallback(
    (e) => {
      e.preventDefault();
      if (detailData) {
        const data = {
          feedId: detailData.feed.feedId,
          content: comment,
        };
        const token = localStorage.getItem("Token");
        axios({
          method: "POST",
          url: "http://localhost:8080" + "/comment/write",
          headers: {
            Authorization: "Bearer " + token,
          },
          data: data,
        })
          .then((res) => {
            console.log(res);
            commentRef.current.value = "";
            setComment("");
            __loadComments();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [detailData, comment, commentRef, __loadComments]
  );

  const __updateLike = useCallback(() => {
    const token = localStorage.getItem("Token");
    return axios({
      method: "get",
      url: "http://localhost:8080/feed/like/" + feedssId,
      // url: GetFeedurl,
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        console.log(res.data + "### 라이크!!");
        if (res.data === "ok") {
          setLikeCount(likeCount + 1);
        } else {
          setLikeCount(likeCount - 1);
        }
        dispatch(layoutAction.likeList(res.data));
      })
      .catch((err) => {
        return err;
      });
  }, [likelist, layout, detailData, likeCount]);

  const __closeDetail = useCallback(() => {
    dispatch(layoutAction.updateDetailState(false));

    dispatch(layoutAction.updateDetailData(undefined));
  }, [dispatch]);

  const __whenKeyDown = useCallback(
    (e) => {
      const code = e.code;
      if (code === "Escape") {
        __closeDetail();
      }
    },
    [__closeDetail]
  );

  useEffect(() => {
    window.addEventListener("keydown", __whenKeyDown);
    return () => {
      window.removeEventListener("keydown", __whenKeyDown);
    };
  }, [__whenKeyDown]);

  useEffect(() => {
    __loadComments();
    return () => {};
  }, [__loadComments]);
  return (
    <div>
      <div className="feed-detail">
        <div className="bg" onClick={__closeDetail}></div>
        <div className="wrapper">
          <div className="close" onClick={__closeDetail}>
            <img src="/assets/feed/close.svg" alt="닫기" />
          </div>
          {/* {detailData.feed.image && <div className="main-image" style={{ backgroundImage: `url(${detailData.feed.image})`></div>} */}
          {detailData.feed.image && (
            <div
              className="main-image"
              style={{ backgroundImage: `url(${detailData.feed.image})` }}
            ></div>
          )}
          <div className="contents">
            <div className="feed-content">
              <div className="top">
                {detailData.user.image && (
                  <div
                    className="profile-image"
                    style={{ backgroundImage: `url(${detailData.user.image})` }}
                    onClick={() => {
                      Router.push(`/user/${detailData.user.username}`);
                    }}
                  ></div>
                )}
                <div className="feed-desc">
                  <div className="nickname txt-bold">
                    {detailData.user.username}
                  </div>
                  <div className="timestamp">
                    {getStartDate()}
                    {makeFeedTime()}
                  </div>
                </div>
              </div>

              <div className="body">{detailData.feed.content}</div>
              <div className="bottom">
                <div className="like">
                  <div className="asset">
                    <img
                      src={
                        likelist === "ok"
                          ? "/assets/feed/like-ac.svg"
                          : "/assets/feed/like-dac.svg"
                      }
                      alt="좋아요"
                      onClick={__updateLike}
                    />
                  </div>
                  <div className="title txt-bold">
                    {/* {layout.likelist}　 */}
                    {/* {detailData.feed.feedlike.length} */}
                    {likeCount}
                  </div>
                </div>
                <div className="comment">
                  <div className="asset">
                    <img src="assets/feed/comment.svg" alt="댓글" />
                  </div>
                  <div className="title txt-bold">{commentData.length}</div>
                </div>
              </div>
            </div>
            <div className="feed-comments">
              {commentData.map((item: any, idx: number) => {
                // {/* // console.log(feeds); */}
                return <Reply key={idx} item={item} reply={item} />;
              })}
            </div>
            <form className="feed-write-comment" onSubmit={__uploadComment}>
              {image && (
                <div
                  className="profile-image"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
              )}
              <div className="write-comment">
                <input
                  type="text"
                  placeholder="댓글을 입력해 주세요"
                  ref={commentRef}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detailfeed;

// {detailData.comments.map((item: any, idx: number) => {
//   // {/* // console.log(feeds); */}
//   return <Reply key={idx} item={detailData} reply={item} />;
// })}
