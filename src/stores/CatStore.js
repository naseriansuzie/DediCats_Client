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
    cut: { Y: 0, N: 0, unknown: 0 },
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
          cut: { Y: 5, N: 0, unknown: 0 },
          rainbow: {
            Y: 17,
            YDate: '2020-02-05',
            N: 0,
            NDate: null,
          },
          species: '코숏',
          today: null,
          todayTime: '2020-02-11T05:50:43.000Z',
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
          {
            id: 4,
            tag: {
              content: '돼냥이',
            },
          },
          {
            id: 11,
            tag: {
              content: '우리동네대장애옹이',
            },
          },
          {
            id: 12,
            tag: {
              content: '귀염뽀짝',
            },
          },
        ],
        {
          path: 'https://source.unsplash.com/nKC772R_qog',
        },
      ],
    today: undefined,
    newTag: '',
    postList: [
      {
        id: 3,
        content: '바보',
        status: 'Y',
        createAt: '2020-02-05T04:15:21.607Z',
        updateAt: '2020-02-05T04:15:21.607Z',
        user: {
          id: 1,
          nickname: 'testUser',
          photoPath: null,
        },
        photos: [
          {
            id: 2,
            path: '경로',
          },
        ],
      },
      {
        id: 1,
        content: '뭐지',
        status: 'Y',
        createAt: '2020-02-05T03:26:25.603Z',
        updateAt: '2020-02-05T03:54:58.000Z',
        user: {
          id: 1,
          nickname: 'testUser',
          photoPath: null,
        },
        photos: [],
      },
    ],
    selectedPost: null,
    inputContent: '',
    commentList: null,
    inputComment: '',
    album:
      // null,
      [
        {
          id: 4,
          path: 'https://source.unsplash.com/hGMvqCyRM9U',
        },
        {
          id: 6,
          path: 'https://source.unsplash.com/nKC772R_qog',
        },
        {
          id: 7,
          path: 'https://source.unsplash.com/hGMvqCyRM9U',
        },
      ],
    uri: null,
    photoPath: null,
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
    rainbowOpen: false,
    rainbowYReported: false,
    rainbowNReported: false,
    cutClicked: { Y: false, N: false, unknown: false },
    reportInfo: null,
  };

  setCatPost = item => {
    this.info.selectedPost = item;
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

  getSelectedCatInfo = catId => {
    const { userId } = this.root.user.info.myInfo;

    axios
      .get(`${SERVER_URL}/cat/${catId}/${userId}`, defaultCredential)
      .then(res => {
        res.data[0].rainbow = JSON.parse(res.data[0].rainbow);
        res.data[0].cut = JSON.parse(res.data[0].cut);
        this.info.selectedCat = res.data;
      })
      .catch(err => console.dir(err));
  };

  followCat = () => {
    const { userId } = this.root.user.info.myInfo;
    const catId = this.info.selectedCat[0].id;
    axios
      .post(`${SERVER_URL}/cat/follow/`, { catId, userId }, defaultCredential)
      .then(res => this.getSelectedCatInfo())
      .catch(err => console.dir(err));
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

  pickImage = async type => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
      base64: true,
    });
    if (!result.cancelled) {
      const imageTarget = `data:image/jpeg;base64,${result.base64}`;
      this[type].uri = result.uri;
      this[type].photoPath = imageTarget;
    }
  };

  selectCut = (observable, type) => {
    this[observable].cut = { Y: 0, N: 0, unknown: 0 };
    runInAction(() => {
      const keys = Object.keys(this[observable].cutClicked);
      const values = Object.values(this[observable].cutClicked);
      keys.forEach((key, idx) => {
        if (key === type) {
          values.splice(idx, 1, true);
        } else values.splice(idx, 1, false);
      });
      this[observable].cutClicked = {
        Y: values[0],
        N: values[1],
        unknown: values[2],
      };
      runInAction(() => {
        this[observable].cut[type] = 1;
      });
    });
  };

  validateAddCat = () => {
    let isValidated = false;
    const {
      location,
      catNickname,
      catDescription,
      catSpecies,
      cutClicked,
    } = this.addCatBio;
    if (
      location &&
      catNickname.length &&
      catDescription.length &&
      catSpecies.length &&
      (cutClicked.Y || cutClicked.N || cutClicked.unknown)
    ) {
      isValidated = true;
    } else Alert.alert('고양이 위치를 포함한 모든 정보를 입력해주세요.');
    return isValidated;
  };

  getAddress = async () => {
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
    //     return this.addCatBio.address;
    //   })
    //   .catch(err => {
    //     console.dir(err);
    //     Alert.alert('좌표가 정확하지 않습니다. 다시 지도에서 선택해주세요!');
    //   });
    this.addCatBio.address = '서울 강남구 대치동';
    return true;
  };

  addCat = async () => {
    const {
      address,
      location,
      photoPath,
      catNickname,
      catDescription,
      catSpecies,
      cut,
    } = this.addCatBio;
    const result = await axios
      .post(
        `${SERVER_URL}/cat/addcat`,
        {
          address,
          location,
          photoPath,
          catNickname,
          catDescription,
          catSpecies,
          cut,
        },
        defaultCredential,
      )
      .then(res => {
        Alert.alert('등록에 성공하였습니다!');
        this.clearAllInput('addCatBio');
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else {
          console.dir(err);
        }
      });

      return result;
  };

  toggleRainbowOpen = () => {
    this.info.rainbowOpen = !this.info.rainbowOpen;
  };

  reportRainbow = type => {
    const report = {
      Y: 0,
      YDate: null,
      N: 0,
      NDate: null,
    };
    report[type] = 1;
    report[`${type}Date`] = this.makeDateTime();

    axios
      .post(`${SERVER_URL}/cat/rainbow`, report, defaultCredential)
      .then(res => {
        if (res.status === 201) {
          this.info.selectedCat[0].rainbow = JSON.parse(res.data);
        }
      })
      .catch(err => console.dir(err));
  };

  disableReportBtn = type => {
    this.info[`rainbow${type}Reported`] = !this.info[`rainbow${type}Reported`];
  };

  postCut = type => {
    const request = { Y: 0, N: 0, unknown: 0 };
    request[type] = 1;
    const catId = this.info.selectedCat[0].id;
    runInAction(() => {
      axios
        .post(`${SERVER_URL}/cat/cut`, { catId, request }, defaultCredential)
        .then(res => {
          this.info.selectedCat[0].cut = JSON.parse(res.data);
        })
        .catch(err => {
          if (err.response && err.response.status === 409) {
            Alert.alert('중성화 유무 등록에 실패했습니다.');
          } else console.dir(err);
        });
    });
  };

  postCatToday = value => {
    this.info.today = value;
    const todayInfo = {
      catToday: value,
      catId: this.info.selectedCat[0].id,
    };
    runInAction(() => {
      axios
        .post(`${SERVER_URL}/cat/addcatToday`, todayInfo, defaultCredential)
        .then(res => {
          this.info.selectedCat[0].today = res.data.cat_today;
          this.info.selectedCat[0].todayTime = this.makeDateTime(
            res.data.cat_today_time,
          );
        })
        .catch(err => {
          if (err.response && err.response.status === 409) {
            Alert.alert('오늘의 건강 상태 등록에 실패했습니다.');
            this.info.today = undefined;
          } else console.log(err);
        });
    });
  };

  validateTag = () => {
    const { newTag } = this.info;
    const tags = this.info.selectedCat[2].map(tagInfo => tagInfo.tag.content);
    if (tags.includes(newTag)) {
      Alert.alert('이미 존재하는 태그입니다!');
      this.clearInput({ group: 'info', key: 'newTag' });
    } else {
      this.postTag(newTag);
    }
  };

  postTag = newTag => {
    const catId = this.info.selectedCat[0].id;
    axios
      .post(
        `${SERVER_URL}/cat/updateTag`,
        { catTag: newTag, catId },
        defaultCredential,
      )
      .then(res => {
        const { tags } = this.info.selectedCat[0];
        this.info.selectedCat[0].tags = [...tags, res.data];
        runInAction(() => {
          this.clearInput({ group: 'info', key: 'newTag' });
        });
      })
      .catch(err => console.log(err));
  };

  getPostList = catId => {
    // 탭 렌더 시 포스트를 받아오는 함수
    // axios로 catPost들을 get해서 this.info.postList 업데이트
  };

  removePhoto = () => {
    this.info.uri = null;
  };

  validateAddInput = type => {
    if (this.info[type]) {
      return true;
    }
    Alert.alert('글을 입력하신 후 등록해주세요!');
    return false;
  };

  addPost = () => {
    const postInfo = {
      content: this.info.inputContent,
      catId: this.info.selectedCat[0].id,
    };
    if (this.info.photoPath) {
      postInfo.photoPath = this.info.photoPath;
    }
    axios
      .post(`${SERVER_URL}/post/new`, postInfo, defaultCredential)
      .then(res =>
        this.clearInput(
          { group: 'info', key: 'content' },
          { group: 'info', key: 'photoPath' },
        ),
      )
      .catch(err => {
        if (err.response && err.response.status === 405) {
          Alert.alert(
            '등록 과정에 문제가 발생했습니다. 관리자에게 문의해주세요.',
          );
          // 로직 확인 필요
        } else {
          Alert.alert('등록에 실패했습니다. 다시 등록해주세요.');
          console.dir(err);
        }
      });
  };

  getCommentList = postId => {
    // 선택한 포스트 기준으로 댓글 리스트를 받아오는 함수
  };

  addComment = () => {
    const catId = this.info.selectedPost.id;
    const commentInfo = { catId, content: this.info.inputComment };
    axios
      .post(`${SERVER_URL}/comment/add`, commentInfo, defaultCredential)
      .then(res => this.clearInput({ group: 'info', key: 'inputComment' }))
      .catch(err => {
        if (err.response && err.response.status === 409) {
          Alert.alert('댓글 업로드에 실패했습니다. 다시 한 번 등록해주세요!');
        } else console.dir(err);
      });
  };

  getAlbums = () => {
    const catId = this.info.selectedCat[0].id;
    axios
      .get(`${SERVER_URL}/photo/album/${catId}`, defaultCredential)
      .then(res => {
        console.log('서버에서 받은 앨범', res.data);
        const photos = res.data.filter(
          photo => photo.path !== this.info.selectedCat[3].path,
        );
        console.log('필터한 앨범', photos);
        this.info.album = photos;
      })
      .catch(err => {
        console.dir(err);
      });
  };

  selectPhoto = photo => {
    this.info.selectedPhoto = photo;
  };

  getFollowerList = catId => {
    console.log('팔로워 리스트를 불러올 고양이 id: ', catId);
    axios
      .get(`${SERVER_URL}/cat/follower/${catId}`, defaultCredential)
      .then(res => (this.info.followerList = res.data))
      .catch(err => console.dir(err));
  };

  makeDateTime = () => {
    const YYYY = new Date().getFullYear();
    const MM =
      new Date().getMonth() > 8
        ? new Date().getMonth()
        : `0${new Date().getMonth() + 1}`;
    const DD =
      new Date().getDate() > 9
        ? new Date().getDate()
        : `0${new Date().getDate()}`;
    return `${YYYY}-${MM}-${DD}`;
  };

  updateInput = (group, key, text) => {
    this[group][key] = text;
    console.log(this[group][key]);
  };

  clearInput = (...pairs) => {
    pairs.forEach(pair => {
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
        cutClicked: { Y: false, N: false, unknown: false },
        cut: { Y: 0, N: 0, unknown: 0 },
      };
    }
  };

  markers = [
    {
      latitude: 37.802597,
      longitude: -122.435197,
      name: 'Best Place',
      content: 'This is the best place in Portland',
      img: require('../../img1.jpg'),
    },
    {
      latitude: 37.79552,
      longitude: -122.41612,
      name: 'Best Place2222',
      content: 'This is the best place in Portland2222',
      img: require('../../img2.jpg'),
    },
    {
      latitude: 37.766552,
      longitude: -122.416128,
      name: 'Best Place3333',
      content: 'This is the best place in Portland3333',
      img: require('../../img3.jpg'),
    },
    {
      latitude: 37.766552,
      longitude: 127.416128,
      name: 'Best Place4444',
      content: 'This is the best place in Portland4444',
      img: require('../../img3.jpg'),
    },
    {
      latitude: 37.503528,
      longitude: 127.049784,
      name: '위워크',
      content: 'This is the best place in Portland4444',
      img: require('../../img3.jpg'),
    },
  ];
}

decorate(CatStore, {
  spot: observable,
  addCatBio: observable,
  info: observable,
  markers: observable,
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
  toggleRainbowOpen: action,
  reportRainbow: action,
  disableReportBtn: action,
  postCut: action,
  postCatToday: action,
  validateTag: action,
  postTag: action,
  removePhoto: action,
  getPostList: action,
  validateAddInput: action,
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
  setCatPost: action,
});

export default CatStore;
