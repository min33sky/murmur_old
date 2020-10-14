import shortid from 'shortid';
import produce from 'immer';
import faker from 'faker';

//----------------------------------------------------------------------------
//* Action Type
//----------------------------------------------------------------------------

export const ADD_POST_REQUEST = 'post/ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'post/ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'post/ADD_POST_FAILURE';
export const ADD_COMMENT_REQUEST = 'post/ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'post/ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'post/ADD_COMMENT_FAILURE';

export const LOAD_POSTS_REQUEST = 'post/LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'post/LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'post/LOAD_POSTS_FAILURE';

export const REMOVE_POST_REQUEST = 'post/REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'post/REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'post/REMOVE_POST_FAILURE';

// ? User Reducer의 업데이트를 위한 액션 타입
// ? 로그인 한 유저의 게시물 수를 업데이트
export const ADD_POST_TO_ME = 'post/ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'post/REMOVE_POST_OF_ME';

//----------------------------------------------------------------------------
//* Action Function
//----------------------------------------------------------------------------

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
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: 'messi',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortid.generate(),
  User: {
    //! messi의 id가 다르므로 문제가 생길 것이다.
    id: shortid.generate(),
    nickname: 'messi',
  },
  content: data,
});

/*
  * 게시물 더미 데이터 생성 함수
  ? 속성 값이 대문자로 시작하는 경우는
  ? 백엔드의 Sequelize의 특성 때문이다.
 */
export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortid.generate(),
      User: {
        id: shortid.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          id: shortid.generate(),
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          id: shortid.generate(),
          User: {
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

//----------------------------------------------------------------------------
//* State & Reducer Function
//----------------------------------------------------------------------------

const initialState = {
  mainPosts: [],
  imagePaths: [], // 업로드 할 이미지 주소
  hasMorePosts: true, // 불러올 게시물이 더 있는지 체크
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
};

// Post Reducer
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      // 게시물 관련
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;

      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = action.payload.concat(draft.mainPosts);
        draft.hasMorePosts = draft.mainPosts.length < 50; // 50개로 제한
        break;

      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.payload;
        break;

      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;

      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(action.payload));
        break;

      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.payload;
        break;

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;

      case REMOVE_POST_SUCCESS: {
        // ? immer를 사용하면 불변성을 지킬 필요는 없지만 filter 쓰는게 편하다. (immer 의도로는 splice가 맞다)
        draft.mainPosts = draft.mainPosts.filter((post) => post.id !== action.payload);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      }

      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.payload;
        break;

      // 댓글 관련

      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        break;

      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.payload.postId);
        post.Comments.unshift(dummyComment(action.payload.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }

      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addPostError = action.payload;
        break;

      default:
        break;
    }
  });

export default reducer;
