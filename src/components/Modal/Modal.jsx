import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const Modal = ({ children, onCloseModal }) => {
  const onBackDropClick = eve => {
    if (eve.currentTarget === eve.target) {
      onCloseModal();
    }
  };

  const onEscKeyPress = useCallback(
    eve => {
      if (eve.key === 'Escape') {
        onCloseModal();
      }
    },
    [onCloseModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', onEscKeyPress);
    return () => {
      document.removeEventListener('keydown', onEscKeyPress);
    };
  }, [onEscKeyPress]);

  return (
    <Wrapper onClick={onBackDropClick}>
      <Content>
        <StyledButtonClose onClick={onCloseModal}>Close</StyledButtonClose>
        <Childrens>{children}</Childrens>
      </Content>
    </Wrapper>
  );
};

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
  z-index: 1111120;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Content = styled.div`
  position: relative;
  display: flex;
  background-color: white;
  width: 90vw;
  height: 90vh;
`;
export const Childrens = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 80vw;
  height: 80vh;
  padding: 10px 30px;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
export const StyledButtonClose = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 12px 20px;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 2px 2px 3px 1px gray;
  transition: all 0.1s ease-in;
  &:hover {
    cursor: pointer;
    background-color: darkblue;
  }
`;
