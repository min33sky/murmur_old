/******************************************
 * 액션 타입
 ******************************************/
export const ADD_POST_REQUEST = 'post/ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'post/ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'post/ADD_POST_FAILURE';
export const ADD_COMMENT_REQUEST = 'post/ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'post/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'post/ADD_COMMENT_FAILURE';

/******************************************
 * 액션 함수
 ******************************************/
export const addPostRequestAction = () => ({
  type: ADD_POST_REQUEST,
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

export const addCommentRequestAction = () => ({
  type: ADD_COMMENT_REQUEST,
  // TODO: 더미 데이터 추가
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
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
      };

    case ADD_POST_SUCCESS:
      return {
        ...state,
        // * 최신 글이 제일 앞에 위치한다.
        mainPosts: [action.payload, ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };

    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.payload,
      };

    // TODO: 댓글 처리
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
      };

    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
      };

    case ADD_COMMENT_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default reducer;
