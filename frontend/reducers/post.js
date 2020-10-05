import shortid from 'shortid';

/** ****************************************
 * 액션 타입
 ***************************************** */
export const ADD_POST_REQUEST = 'post/ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'post/ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'post/ADD_POST_FAILURE';
export const ADD_COMMENT_REQUEST = 'post/ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'post/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'post/ADD_COMMENT_FAILURE';

export const REMOVE_POST_REQUEST = 'post/REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'post/REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'post/REMOVE_POST_FAILURE';

// ? User Reducer의 업데이트를 위한 액션 타입
// ? 로그인 한 유저의 게시물 수를 업데이트
export const ADD_POST_TO_ME = 'post/ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'post/REMOVE_POST_OF_ME';

/** ****************************************
 * 액션 함수
 ***************************************** */
export const addPostRequestAction = (data) => ({
  type: ADD_POST_REQUEST,
  payload: data,
});

export const addCommentRequestAction = (data) => ({
  type: ADD_COMMENT_REQUEST,
  payload: data,
});

export const removePostRequestAction = (postId) => ({
  type: REMOVE_POST_REQUEST,
  payload: postId,
});

const dummyPost = (data) => ({
  ...data,
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortid.generate(),
  User: {
    // !! messi의 id가 다르므로 문제가 생길 것이다.
    id: shortid.generate(),
    nickname: 'messi',
  },
  content: data,
});

/** ****************************************
 * 초기 상태 및 리듀서 함수
 ***************************************** */
const initialState = {
  /*
    ? 속성 값이 대문자로 시작하는 경우는
    ? 백엔드의 Sequelize의 특성 때문이다.
   */
  mainPosts: [
    {
      id: shortid.generate(),
      User: {
        id: shortid.generate(),
        nickname: 'messi',
      },
      content: '첫 번째 게시글 #첫번째 #일빠',
      Images: [
        {
          id: shortid.generate(),
          src:
            'https://i.pinimg.com/236x/d9/82/f4/d982f4ec7d06f6910539472634e1f9b1.jpg',
        },
        {
          id: shortid.generate(),
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
          id: shortid.generate(),
          User: {
            nickname: 'ronaldo',
          },
          content: '1등',
        },
        {
          id: shortid.generate(),
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
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
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
        mainPosts: [dummyPost(action.payload), ...state.mainPosts],
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
        addCommentLoading: true,
        addCommentDone: false,
      };

    case ADD_COMMENT_SUCCESS: {
      // 해당 글의 id를 찾고 comments에 응답 결과를 넣어준다.
      // content, postId, userId

      const postIndex = state.mainPosts.findIndex(
        (element) => element.id === action.payload.postId,
      );

      const post = { ...state.mainPosts[postIndex] };
      post.Comments = [dummyComment(action.payload.content), ...post.Comments];

      const mainPosts = [...state.mainPosts];

      mainPosts[postIndex] = post;

      return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }

    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.payload,
      };

    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
      };

    case REMOVE_POST_SUCCESS: {
      const posts = state.mainPosts.filter(
        (post) => post.id !== action.payload,
      );

      return {
        ...state,
        removePostLoading: false,
        removePostDone: true,
        mainPosts: posts,
      };
    }

    case REMOVE_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
