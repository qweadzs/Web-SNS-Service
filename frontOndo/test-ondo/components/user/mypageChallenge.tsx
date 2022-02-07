import React from 'react';
import Image from 'next/image';
import temp_profile from 'public/images/temp_profile.jpg'
import { Modal, Button, Col, Row } from 'antd';
import styled from 'styled-components';
import Router from 'next/router'


const Challengebox = ({challenge}: any) => {
  
  return (
    <Title span={6}>
        <Content src={challenge.image} onClick={()=>{Router.push('/challenge/1')}}></Content>
    </Title>

  )
}

const Title = styled(Col)`
  padding: 10px;

`

const Content = styled.img`
  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }
  cursor: pointer;
`


export default Challengebox;