import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

/**
 * 1. spot 관련
 *  - 팔로우하는 고양이 수
 *  - spotList = [ {bounds 안 고양이 위치정보} ]
 * 2. addCatBio = {
 *   img: fileName,
 *   name: string,
 *   desc: string,
 *   species: string,
 *   tagInput: string,
 *   tags: array,
 *   cut: {Y: number, N: number, unknown: number}
 * }
 * 3. cat 관련
 *  - selectedCat = [{선택한 고양이에 대한 bio}] <- 1마리면 배열에 요소 1개, 2마리 이상이면 배열에 요소 2개 이상
 *  - newTag = ""
 *  - postList = [{각 포스트에 관한 정보}]
 *  - selectedPost = 5번의 객체 하나 -> {}
 *  - inputContent = string (post의 내용)
 *  - inputPhoto = data (post의 사진)
 *  - commentList = [{6번 기준 달린 댓글들}]
 *  - inputComment = string (댓글 내용)
 *  - album = [{해당 postId에 따른 사진 정보들}]
 *  - followerList = [{해당 catId에 따른 follower들}]
 *  - reportInfo = {신고할 (postId || commentId || catId) && criminalId (userId?)}
 */

const defaultCredential = { withCredentials: true };
class CatStore {
  constructor(root) {
    this.root = root;
  }

  // observable
  spot = {
    followCatNum: 0, // 어디다 쓰지?
    list: null,
    selectedSpot: null,
  };

  addCatBio = {
    location: 'hello',
    photoPath: null,
    catNickname: '',
    catDescription: '',
    catSpecies: '',
    catTag: '',
    // catTags: null, -> 고양이 등록 시 태그 등록은 1개만
    cutClicked: { Y: false, N: false, unknown: false },
    catCut: { Y: 0, N: 0, unknown: 0 },
  };

  catInfo = {
    selectedCat: null,
    newTag: '',
    postList: null,
    selectedPost: null,
    inputContent: '',
    inputPhoto: null,
    commentList: null,
    inputComment: '',
    album: null,
    followerList: null,
    reportInfo: null,
  };

  // actions
  getMapInfo = (lat, long) => {
    // axios로 map 정보 get
    // res => this.spot.list에 추가
    // err => err.response.status = 404이면 this.spot.list를 빈 배열로 추가
  };

  getSelectedSpotInfo = (lat, long) => {
    const selectedSpotCats = this.spot.list.filter(
      cat => cat.location[0] === lat && cat.location[1] === long,
    );
    this.spot.selectedSpot = selectedSpotCats;
  };

  getSelectedCatInfo = catId => {
    // axios로 해당 cat 정보 get
    // res => this.catInfo.selectedCat = res.data
    // err => console
  };

  followCat = catId => {
    const {
      user: {
        userInfo: {
          myInfo: { userId },
        },
      },
    } = this.root;
    const followingInfo = { catId, userId };
    // axios로 follow cat post, followingInfo 담아서 req.body로 보내기
    // res => this.catInfo.selectedCat.isFollowing을 true로
  };

  // 고양이 등록 시 태그 여러 개 등록할 때 사용, 태그 1개만 등록하는 것으로 바뀜, 주석처리
  // createTagBeforeAddCat = () => {
  //   this.addCatBio.catTags = [...this.addCatBio.catTags, this.addCatBio.catTag];
  //   this.addCatBio.catTag = '';
  //  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('사진을 올리기 위해 접근 권한이 필요합니다.');
      }
    }
  };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log('고른 이미지', result);

    if (!result.cancelled) {
      this.addCatBio.photoPath = result.uri;
    }
  };

  selectCut = type => {
    const keys = Object.keys(this.addCatBio.cutClicked);
    const values = Object.values(this.addCatBio.cutClicked);
    keys.forEach((key, idx) => {
      if (key === type) {
        values.splice(idx, 1, true);
      } else values.splice(idx, 1, false);
    });
    this.addCatBio.cutClicked = {
      Y: values[0],
      N: values[1],
      unknown: values[2],
    };
  };

  validateAddCat = () => {
    let isValidated = false;
    const {
      location,
      catNickname,
      catDescription,
      catSpecies,
      catTag,
      cutClicked,
    } = this.addCatBio;
    if (
      location &&
      catNickname.length &&
      catDescription.length &&
      catSpecies.length &&
      catTag &&
      (cutClicked.Y || cutClicked.N || cutClicked.unknown)
    ) {
      isValidated = true;
    } else Alert.alert('고양이 위치를 포함한 모든 정보를 입력해주세요.');
    return isValidated;
  };

  addCat = () => {
    const {
      location,
      photoPath,
      catNickname,
      catDescription,
      catSpecies,
      catCut,
      catTag,
    } = this.addCatBio;
    axios
      .post(
        `${process.env.SERVER_URL}/cat/addcat`,
        {
          location,
          photoPath,
          catNickname,
          catDescription,
          catSpecies,
          catCut,
          catTag,
        },
        defaultCredential,
      )
      .then(res => {
        Alert.alert('등록에 성공하였습니다!');
        this.clearAllInput('addCatBio');
      })
      .catch(err => {
        if (err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else console.log(err);
      });
  };

  reportRainbow = type => {
    const {
      selectedCat: { rainbow },
    } = this.catInfo;
    const willChangeRainbow = rainbow;
    willChangeRainbow[type] += willChangeRainbow[type];
    willChangeRainbow[`${type}_Date`] = this.makeDateTime();
    // axios로 report Rainbow post하기, req.body는 willChangeRainbow
    // res => rainbow: res.data
    // err => console
  };

  updateCut = type => {
    const request = { Y: 0, N: 0, unknown: 0 };
    request[type] = 1;
    // axios로 cut post하기, req.body는 request
    // res => CatInfo.selectedCat.cut : res.data
    // err => console
  };

  createTag = () => {
    // axios로 this.catInfo.newTag와 this.catInfo.selectedCat.catId를 post 보냄
    // res => clearInput({group: "cat", key: "newTag"}) 실행
    // err => alert 처리
    // 근데 지금 api에서 안 찾아짐 -> 확인 필요
  };

  getPostList = catId => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.catInfo.postList 업데이트
  };

  addPost = () => {
    // 인풋메시지와 포토를 등록하는 함수
  };

  getCommentList = postId => {
    // 선택한 포스트 기준으로 댓글 리스트를 받아오는 함수
  };

  addComment = () => {
    // 댓글 인풋 메시지를 등록하는 함수
  };

  getAlbums = catId => {
    // 탭 렌더 시 앨범 리스트를 받아오는 함수
  };

  selectPhoto = photoId => {
    // 앨범에서 선택한 포토를 기준으로 모달에 띄우는 함수
  };

  getFollowerList = catId => {
    // 탭 렌더 시 팔로워 리스트를 받아오는 함수
  };

  makeDateTime = () => {
    const YYYY = new Date().getFullYear();
    const MM =
      new Date().getMonth() > 9
        ? new Date().getMonth()
        : `0${new Date().getMonth()}`;
    const DD =
      new Date().getDate() > 9
        ? new Date().getDate()
        : `0${new Date().getDate()}`;
    return `${YYYY}-${MM}-${DD}`;
  };

  updateInput = (group, key, text) => {
    this[group][key] = text;
  };

  clearInput = (...pairs) => {
    pairs.forEach(function(pair) {
      const { group, key } = pair;
      this[group][key] = '';
    });
  };

  clearAllInput = type => {
    if (type === 'addCatBio') {
      this.addCatBio = {
        location: null,
        photoPath: null,
        catNickname: '',
        catDescription: '',
        catSpecies: '',
        catTag: '',
        cutClicked: { Y: false, N: false, unknown: false },
        catCut: { Y: 0, N: 0, unknown: 0 },
      };
    }
  };
}

decorate(CatStore, {
  spot: observable,
  addCatBio: observable,
  catInfo: observable,
  getMapInfo: action,
  getSelectedSpotInfo: action,
  getSelectedCatInfo: action,
  followCat: action,
  // createTagBeforeAddCat: action, -> 고양이 등록 시 태그는 1개만
  getPermissionAsync: action,
  pickImage: action,
  selectCut: action,
  validateAddCat: action,
  addCat: action,
  reportRainbow: action,
  updateCut: action,
  createTag: action,
  getPostList: action,
  addPost: action,
  getCommentList: action,
  addComment: action,
  getAlbums: action,
  selectPhoto: action,
  getFollowerList: action,
  makeDateTime: action,
  updateInput: action,
  clearInput: action,
  clearAllInput: action,
});

export default CatStore;
