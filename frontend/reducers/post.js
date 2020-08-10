/******************************************
 * 액션 타입
 ******************************************/
const ADD_POST = 'post/ADD_POST';

/******************************************
 * 액션 함수
 ******************************************/
export const addPostAction = () => ({
  type: ADD_POST,
  payload: {
    id: 2,
    User: {
      id: 2,
      nickname: 'ronaldo',
    },
    Images: [],
    Comments: [],
  },
});

/******************************************
 * 초기 상태 및 리듀서 함수
 ******************************************/
const initialState = {
  /*
    ? 속성 값이 대문자로 시작하는 경우는
    ? 백엔드의 Sequelize의 특성 때문이다.
   */
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: 'messi',
      },
      content: '첫 번째 게시글 #첫번째 #일빠',
      Images: [
        {
          src:
            'https://i.pinimg.com/236x/d9/82/f4/d982f4ec7d06f6910539472634e1f9b1.jpg',
        },
        {
          src:
            'https://i.pinimg.com/originals/05/1f/f3/051ff3fb781ff83c9b0f8a32f9922fa6.png',
        },
        // {
        //   src:
        //     'https://i.pinimg.com/originals/05/1f/f3/051ff3fb781ff83c9b0f8a32f9922fa6.png',
        // },
      ],
      Comments: [
        {
          User: {
            nickname: 'ronaldo',
          },
          content: '1등',
        },
        {
          User: {
            nickname: 'neymar',
          },
          content: '2등',
        },
      ],
    },
  ],
  imagePaths: [], // 업로드 할 이미지 주소
  postAdded: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        // 최신 글이 제일 앞에 위치한다.
        mainPosts: [action.payload, ...state.mainPosts],
      };

    default:
      return state;
  }
};

export default reducer;