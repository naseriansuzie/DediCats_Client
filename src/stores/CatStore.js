import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL, KAKAO_MAPS_API_KEY } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

/**
 * 1. spot 관련
 *  - 팔로우하는 고양이 수
 *  - list = [ {bounds 안 고양이 위치정보} ]
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
    selected: null,
  };

  addCatBio = {
    address: '',
    location: { latitude: 127.049784, longitude: 127.049784 },
    photoPath: null,
    catNickname: '',
    catDescription: '',
    catSpecies: '',
    catTag: '',
    catCut: { Y: 0, N: 0, unknown: 0 },
    uri: null,
    cutClicked: { Y: false, N: false, unknown: false },
  };

  info = {
    selectedCat:
      // null,
      [
        {
          id: 1,
          description: '완전 귀염이 넘치는 아이에요.',
          location: 'POINT(1 2)',
          address: '서울시 강남구 대치동',
          nickname: '애옹이',
          cut: "{ 'Y':5, 'N': 0, 'unknown': 0 }",
          rainbow:
            "{ 'Y': 2, 'YDate': 2020-02-01, 'N': 3, 'NDate': 2020-02-06 }",
          species: null,
          today: '건강해요:+1:',
          todayTime: '2020-02-06T05:50:43.000Z',
          status: 'Y',
          createAt: '2020-02-05T03:26:25.561Z',
          updateAt: '2020-02-06T11:30:24.000Z',
        },
        {
          isFollowing: false,
        },
        [
          {
            id: 7,
            tag: {
              content: '초큐트',
            },
          },
        ],
        {
          path: 'https://source.unsplash.com/hGMvqCyRM9U',
        },
      ],
    newTag: '',
    postList: null,
    selectedPost: null,
    inputContent: '',
    inputPhoto: null,
    commentList: null,
    inputComment: '',
    album: null,
    followerList:
      // null,
      [
        {
          id: 1,
          users: [
            {
              id: 1,
              nickname: 'testUser',
              photoPath: null,
            },
            {
              id: 2,
              nickname: 'Joshua',
              photoPath: null,
            },
            {
              id: 3,
              nickname: 'perry',
              photoPath: null,
            },
            {
              id: 4,
              nickname: 'testUser',
              photoPath: null,
            },
            {
              id: 5,
              nickname: 'Joshua',
              photoPath: null,
            },
            {
              id: 6,
              nickname: 'perry',
              photoPath: null,
            },
            {
              id: 7,
              nickname: 'testUser',
              photoPath: null,
            },
            {
              id: 8,
              nickname: 'Joshua',
              photoPath: null,
            },
            {
              id: 9,
              nickname: 'perry',
              photoPath: null,
            },
          ],
        },
      ],
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
    this.spot.selected = selectedSpotCats;
  };

  getSelectedCatInfo = () => {
    const { userId } = this.root.user.info.myInfo;
    const catId = this.info.selectedPost[0].id;
    console.log('고양이 정보 가져오기', userId, catId);
    axios
      .get(`${SERVER_URL}/cat/${catId}/${userId}`, defaultCredential)
      .then(res => (this.info.selectedCat = res.data))
      .catch(err => console.log(err));
  };

  followCat = () => {
    const { userId } = this.root.user.info.myInfo;
    const catId = this.info.selectedCat[0].id;
    axios
      .post(`${SERVER_URL}/cat/follow/`, { catId, userId }, defaultCredential)
      .then(res => this.getSelectedCatInfo())
      .catch(err => console.log(err));
    // test용으로 넣은 코드
    this.info.selectedCat[1].isFollowing = true;
  };

  // {latitude: Number, longitude: Number}
  onDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.addCatBio.location = { latitude, longitude };
  };

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
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      this.addCatBio.uri = result.uri;
      this.addCatBio.photoPath = result.base64;
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

  getAddress = () => {
    const { latitude, longitude } = this.addCatBio.location;
    console.log(latitude, longitude);
    /* API 제한 때문에 실제로 서버 연동 후에 주석 풀 예정 */
    // axios
    //   .get(
    //     `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`,
    //     {
    //       headers: {
    //         Authorization: `KakaoAK ${KAKAO_MAPS_API_KEY}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     const {
    //       region_1depth_name,
    //       region_2depth_name,
    //       region_3depth_name,
    //     } = res.data.documents[0].address;
    //     console.log(region_1depth_name, region_2depth_name, region_3depth_name);
    //     this.addCatBio.address = `${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`;
    //     return true;
    //   })
    //   .catch(err => {
    //     console.dir(err);
    //     Alert.alert('좌표가 정확하지 않습니다. 다시 지도에서 선택해주세요!');
    //   });
  };

  addCat = () => {
    const {
      address,
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
        `${SERVER_URL}/cat/addcat`,
        {
          address,
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
        return true;
      })
      .catch(err => {
        if (err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else console.log(err);
      });
  };

  reportRainbow = type => {
    const report = {
      Y: 0,
      YDate: null,
      N: 0,
      NDate: null,
    };
    report[type] += report[type];
    report[`${type}Date`] = this.makeDateTime();

    axios
      .post(`${SERVER_URL}/cat/rainbow`, report, defaultCredential)
      .then(res => {
        if (res.status === 201) {
          this.info.selectedCat[0].rainbow = JSON.parse(res.data);
        } else if (res.status === 200) {
          Alert.alert('신고가 불가능합니다?');
        }
      })
      .catch(err => console.log(err));
  };

  updateCut = type => {
    const request = { Y: 0, N: 0, unknown: 0 };
    request[type] = 1;
    // axios로 cut post하기, req.body는 request
    // res => CatInfo.selectedCat.cut : res.data
    // err => console
  };

  createTag = () => {
    // axios로 this.info.newTag와 this.info.selectedCat.catId를 post 보냄
    // res => clearInput({group: "cat", key: "newTag"}) 실행
    // err => alert 처리
    // 근데 지금 api에서 안 찾아짐 -> 확인 필요
  };

  getPostList = catId => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.info.postList 업데이트
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
    console.log('팔로워 리스트를 불러올 고양이 id: ', catId);
    axios
      .get(`${SERVER_URL}/cat/follower/${catId}`, defaultCredential)
      .then(res => (this.info.followerList = res.data))
      .catch(err => console.log(err));
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
        uri: null,
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
  info: observable,
  getMapInfo: action,
  getSelectedSpotInfo: action,
  getSelectedCatInfo: action,
  followCat: action,
  onDragEnd: action,
  getPermissionAsync: action,
  pickImage: action,
  selectCut: action,
  validateAddCat: action,
  getAddress: action,
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
