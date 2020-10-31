import React from 'react';
import wrapper from '../../store/configureStore';

function User() {
  return <div>USER 게시물 페이지</div>;
}

//-----------------------------------------------------------------------------
//* Server-Side-Rendering
//-----------------------------------------------------------------------------

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // TODO
});

export default User;
