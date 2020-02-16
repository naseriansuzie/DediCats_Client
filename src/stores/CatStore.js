import { observable, action, computed, decorate, runInAction } from 'mobx';
import { Alert } from 'react-native';
import axios from 'axios';
import { SERVER_URL, KAKAO_MAPS_API_KEY } from 'react-native-dotenv';
import * as ImagePicker from 'expo-image-picker';

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

  // CatStore
  // addCatBio = {
  //   address: '',
  //   location: { latitude: 127.049784, longitude: 127.049784 },
  //   addCatPhotoPath: null,
  //   catNickname: '',
  //   catDescription: '',
  //   catSpecies: '',
  //   cut: { Y: 0, N: 0, unknown: 0 },
  //   addCatUri: null,
  //   cutClicked: { Y: false, N: false, unknown: false },
  // };

  // 등록할 주소
  addCatAddress = '';

  // 등록할 위치
  addCatLocation = { latitude: 37.049784, longitude: 127.049784 };

  // 등록할 사진경로
  addCatPhotoPath = null;

  // 등록할 닉네임
  addCatNickname = '';

  // 등록할 소개글
  addCatDescription = '';

  // 등록할 종
  addCatSpecies = '';

  // 등록할 중성화
  addCatCut = { Y: 0, N: 0, unknown: 0 };

  // 등록할 사진 미리보기 uri
  addCatUri = null;

  // 등록할 중성화 선택
  addCatCutClicked = { Y: false, N: false, unknown: false };

  // CatStore -> info 안의 요소들을 꺼내서 개별적인 observable로 변경 가능
  // BriefCatInfo 에서 선택한 cat info
  selectedCatBio = null; // 다른 스토어도 selectedCat -> selectedCatBio

  // 오늘의 상태 태그
  selectedCatToday = undefined;

  // 새로 추가하려는 태그
  selectedCatNewTag = '';

  // postList에서 선택한 post
  selectedCatPost = null;

  // post를 추가할 때의 content
  selectedCatInputContent = '';

  // post에 해당하는 commentList
  selectedCatCommentList = null;

  // 작성하는 댓글
  selectedCatInputComment = '';

  // 해당 고양이의 앨범
  selectedCatAlbum = null;

  // 해당 고양이 Uri
  selectedCatUri = null;

  // 해당 고양이 Photo
  selectedCatPhoto = null;

  // 해당 고양이 PhotoPath
  selectedCatPhotoPath = null;

  // 해당 고양이 FollwerList
  selectedCatFollowerList = null;

  // 해당 고양이 무지개 boolean
  selectedCatRainbowOpen = false;

  // 해당 고양이 무지개 Y
  selectedCatRainbowYReported = false;

  // 해당 고양이 무지개 N
  selectedCatRainbowNReported = false;

  // 해당 고양이 중성화 선택
  selectedCatCutClicked = { Y: false, N: false, unknown: false };

  // 해당 고양이(포스트) 신고
  selectedCatReportInfo = null;

  // info = {
  // [
  //   {
  //     id: 2,
  //     description: '완전 귀염이 넘치는 아이에요.',
  //     location: 'POINT(1 2)',
  //     address: '서울시 강남구 대치동',
  //     nickname: '애옹이',
  //     cut: { Y: 5, N: 0, unknown: 0 },
  //     rainbow: {
  //       Y: 17,
  //       YDate: '2020-02-05',
  //       N: 0,
  //       NDate: null,
  //     },
  //     species: '코숏',
  //     today: null,
  //     todayTime: '2020-02-11T05:50:43.000Z',
  //     status: 'Y',
  //     createAt: '2020-02-05T03:26:25.561Z',
  //     updateAt: '2020-02-06T11:30:24.000Z',
  //   },
  //   {
  //     isFollowing: false,
  //   },
  //   [
  //     {
  //       id: 7,
  //       tag: {
  //         content: '초큐트',
  //       },
  //     },
  //   ],
  //   {
  //     path: 'https://source.unsplash.com/nKC772R_qog',
  //   },
  // ],

  //   {
  //     id: 3,
  //     content: '바보',
  //     status: 'Y',
  //     createAt: '2020-02-05T04:15:21.607Z',
  //     updateAt: '2020-02-05T04:15:21.607Z',
  //     user: {
  //       id: 1,
  //       nickname: 'testUser',
  //       photoPath:
  //         '/Users/danielkim/Desktop/codestates/IM/DediCats-client/userLocation.png',
  //     },
  //     photos: [
  //       {
  //         id: 2,
  //         path:
  //           '/Users/danielkim/Desktop/codestates/IM/DediCats-client/img1.jpg',
  //       },
  //     ],
  //   },
  // ],

  // [
  //   {
  //     id: 4,
  //     path: 'https://source.unsplash.com/hGMvqCyRM9U',
  //   },
  //   {
  //     id: 6,
  //     path: 'https://source.unsplash.com/nKC772R_qog',
  //   },
  // ],

  // [
  //   {
  //     id: 1,
  //     users: [
  //       {
  //         id: 1,
  //         nickname: 'testUser',
  //         photoPath: null,
  //       },
  //       {
  //         id: 2,
  //         nickname: 'Joshua',
  //         photoPath: null,
  //       },
  //       {
  //     ],
  //   },
  // ],
  // };

  // CatStore
  setCatPost = (item) => {
    this.selectedCatPost = item;
  };

  // actions
  /**
   * 1. 마커 배열과 carousel 배열을 분리
   * 2. 마커 배열에는 POST 요청한 boundingBox 안에 존재하는 마커들만 할당
   * 3. 마커를 클릭했을 때, 그 당시 boundingBox 안에 존재하는 마커들을 carouselItem에 새로 할당
   */
  //! catId, catNickname, catAddress, latitude, longitude, description, catProfile

  // getSelectedSpotInfo = (lat, long) => {
  //   const selectedSpotCats = this.spot.list.filter(
  //     (cat) => cat.location[0] === lat && cat.location[1] === long,
  //   );
  //   this.spot.selected = selectedSpotCats;
  // };

  getSelectedCatInfo = async (catId) => {
    console.log('클릭이되나?:', catId);
    const result = await axios
      .get(`${SERVER_URL}/cat/${catId}`, defaultCredential)
      .then(res => {
        console.log('고양이 정보', res.data);
        if (res.data[0].todayTime) {
          // Helper Store
          res.data[0].todayTime = this.root.helper.changeToDateTime(res.data[0].todayTime);
        }
        if (res.data[0].rainbow) {
          res.data[0].rainbow = JSON.parse(res.data[0].rainbow);
        }
        res.data[0].cut = JSON.parse(res.data[0].cut);
        this.selectedCatBio = res.data;
        // const replacement = this.markers;
        // this.carousels = replacement;

        return true;
      })
      .catch(err => {
        console.dir(err);
        return false;
      });
    console.log('함수', result);
    return result;
  };

  // CatStore
  followCat = () => {
    const catId = this.selectedCatBio[0].id;
    axios
      .post(`${SERVER_URL}/cat/follow/`, { catId }, defaultCredential)
      .then((res) => {
        this.getSelectedCatInfo(catId);
        this.getFollowerList(catId);
      })
      .catch((err) => console.dir(err));
  };

  // CatStore
  selectCut = (variable, type) => {
    if (variable === 'addCatBio') {
      this[`${variable}Cut`] = { Y: 0, N: 0, unknown: 0 };
    } 
    // this[variable].cut = { Y: 0, N: 0, unknown: 0 };
    runInAction(() => {
      const keys = Object.keys(this[variable].cutClicked);
      const values = Object.values(this[variable].cutClicked);
      keys.forEach((key, idx) => {
        if (key === type) {
          values.splice(idx, 1, true);
        } else values.splice(idx, 1, false);
      });

      // this[variable].cutClicked = {
      this[`${variable}CutClicked`] = {
        Y: values[0],
        N: values[1],
        unknown: values[2],
      };
      if (variable === 'addCatBio') {
        runInAction(() => {
          this[`${variable}Cut`][type] = 1;
        });
      }
    });
  };

  // CatStore
  validateAddCat = () => {
    let isValidated = false;
    // const {
    //   location,
    //   catNickname,
    //   catDescription,
    //   catSpecies,
    //   cutClicked,
    // } = this.addCatBio;
    const {
      addCatLocation,
      addCatNickname,
      addCatDescription,
      addCatSpecies,
      addCatCutClicked,
    } = this;
    if (
      addCatLocation
      && addCatNickname.length
      && addCatDescription.length
      && addCatSpecies.length
      && (addCatCutClicked.Y || addCatCutClicked.N || addCatCutClicked.unknown)
    ) {
    // if (
    //   location &&
    //   catNickname.length &&
    //   catDescription.length &&
    //   catSpecies.length &&
    //   (cutClicked.Y || cutClicked.N || cutClicked.unknown)
    // ) {
      isValidated = true;
    } else Alert.alert('고양이 위치를 포함한 모든 정보를 입력해주세요.');
    return isValidated;
  };

  // MapStore
  getAddress = async () => {
    const { latitude, longitude } = this.addCatLocation;
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
    //     this.addCatAddress = `${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`;
    //     return this.addCatAddress;
    //   })
    //   .catch(err => {
    //     console.dir(err);
    //     Alert.alert('좌표가 정확하지 않습니다. 다시 지도에서 선택해주세요!');
    //   });
    this.addCatAddress = '서울 강남구 대치동';
    return true;
  };

  // CatStore
  addCat = async () => {
    // const {
    //   address,
    //   location,
    //   addCatPhotoPath,
    //   catNickname,
    //   catDescription,
    //   catSpecies,
    //   cut,
    // } = this.addCatBio;
    const {
      addCatAddress,
      addCatLocation,
      addCatPhotoPath,
      addCatNickname,
      addCatDescription,
      addCatSpecies,
      addCatCut,
    } = this;
    const result = await axios
      .post(
        `${SERVER_URL}/cat/addcat`,
        // {
        //   address,
        //   location,
        //   addCatPhotoPath,
        //   catNickname,
        //   catDescription,
        //   catSpecies,
        //   cut,
        // },
        {
          address: addCatAddress,
          location: addCatLocation,
          photoPath: addCatPhotoPath,
          catNickname: addCatNickname,
          catDescription: addCatDescription,
          catSpecies: addCatSpecies,
          cut: addCatCut,
        },
        defaultCredential,
      )
      .then((res) => {
        Alert.alert('등록에 성공하였습니다!');
        this.root.helper.clearAllInput('addCatBio');
        return true;
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else {
          console.dir(err);
        }
      });

    return result;
  };

  // CatStore
  toggleRainbowOpen = () => {
    this.selectedCatRainbowOpen = !this.selectedCatRainbowOpen;
  };

  // CatStore
  reportRainbow = async (type) => {
    const catId = this.selectedCatBio[0].id;
    const rainbow = {
      Y: 0,
      YDate: null,
      N: 0,
      NDate: null,
    };
    rainbow[type] = 1;
    rainbow[`${type}Date`] = this.root.helper.makeDateTime();
    const result = axios
      .post(`${SERVER_URL}/cat/rainbow`, { catId, rainbow }, defaultCredential)
      .then((res) => {
        this.selectedCatBio[0].rainbow = JSON.parse(res.data.rainbow);
        return res.data;
      })
      .catch((err) => console.dir(err));
    return result;
  };

  // CatStore
  disableReportBtn = (type) => {
    this[`selectedCatRainbow${type}Reported`] = !this[`selectedCatRainbow${type}Reported`];
  };

  // CatStore
  postCut = (type) => {
    const request = { Y: 0, N: 0, unknown: 0 };
    request[type] = 1;
    const catId = this.selectedCatBio[0].id;
    runInAction(() => {
      axios
        .post(
          `${SERVER_URL}/cat/cut`,
          { catId, catCut: request },
          defaultCredential,
        )
        .then(res => {
          this.selectedCatBio[0].cut = JSON.parse(res.data.cut);
        })
        .catch(err => {
          if (err.response && err.response.status === 409) {
            Alert.alert('중성화 유무 등록에 실패했습니다.');
          } else console.dir(err);
        });
    });
  };

  // CatStore
  postCatToday = (value) => {
    this.selectedCatToday = value;
    const todayInfo = {
      catToday: value,
      catId: this.selectedCatBio[0].id,
    };
    runInAction(() => {
      axios
        .post(`${SERVER_URL}/cat/addcatToday`, todayInfo, defaultCredential)
        .then((res) => {
          this.selectedCatBio[0].today = res.data.cat_today;
          this.selectedCatBio[0].todayTime = this.root.helper.makeDateTime(
            res.data.cat_today_time,
          );
        })
        .catch((err) => {
          if (err.response && err.response.status === 409) {
            Alert.alert('오늘의 건강 상태 등록에 실패했습니다.');
            this.selectedCatToday = undefined;
          } else console.dir(err);
        });
    });
  };

  // CatStore
  validateTag = () => {
    const { selectedCatNewTag } = this;
    const tags = this.selectedCatBio[2].map((tagInfo) => tagInfo.tag.content);
    if (tags.includes(selectedCatNewTag)) {
      Alert.alert('이미 존재하는 태그입니다!');
      // Helper Store
      this.root.helper.clearInput({ group: 'info', key: 'newTag' });
    } else {
      this.postTag(selectedCatNewTag);
    }
  };

  // CatStore
  postTag = (newTag) => {
    const catId = this.selectedCatBio[0].id;
    axios
      .post(
        `${SERVER_URL}/cat/updateTag`,
        { catTag: newTag, catId },
        defaultCredential,
      )
      .then((res) => {
        const tags = this.selectedCatBio[2];
        tags.push(res.data);
        runInAction(() => {
          // Helper Store
          this.root.helper.clearInput({ group: 'info', key: 'newTag' });
        });
      })
      .catch((err) => console.dir(err));
  };

  getCommentList = (postId) => {
    // 선택한 포스트 기준으로 댓글 리스트를 받아오는 함수
  };

  addComment = () => {
    const catId = this.selectedCatPost.id;
    const commentInfo = { catId, content: this.selectedCatInputComment };
    axios
      .post(`${SERVER_URL}/comment/add`, commentInfo, defaultCredential)
      // Helper Store
      .then((res) => this.root.helper.clearInput({ group: 'info', key: 'inputComment' }))
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          Alert.alert('댓글 업로드에 실패했습니다. 다시 한 번 등록해주세요!');
        } else console.dir(err);
      });
  };

  getAlbums = () => {
    const catId = this.selectedCatBio[0].id;
    axios
      .get(`${SERVER_URL}/photo/album/${catId}`, defaultCredential)
      .then((res) => {
        console.log('서버에서 받은 앨범', res.data);
        const photos = res.data.filter(
          (photo) => photo.path !== this.selectedCatBio[3].path,
        );
        console.log('필터한 앨범', photos);
        this.selectedCatAlbum = photos;
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  selectPhoto = (photo) => {
    this.selectedCatPhoto = photo;
  };

  getFollowerList = (catId) => {
    console.log('팔로워 리스트를 불러올 고양이 id: ', catId);
    axios
      .get(`${SERVER_URL}/cat/follower/${catId}`, defaultCredential)
      .then((res) => {
        this.selectedCatFollowerList = res.data;
        console.log(this.selectedCatFollowerList);
      })
      .catch((err) => console.dir(err));
  };

  carousels = [
    //! sample data
    // {
    //   catId: 1,
    //   latitude: 37.503528,
    //   longitude: 127.049784,
    //   catNickname: 'Best Place',
    //   catAddress: '서울시 선릉',
    //   description: 'This is the best place in Portland',
    //   catProfile: 'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/CAT%20%2314',
    // },
  ];

  markers = [
    // {
    //   catId: 1,
    //   latitude: 37.503528,
    //   longitude: 127.049784,
    //   catNickname: 'Best Place',
    //   catAddress: '서울시 선릉',
    //   description: 'This is the best place in Portland',
    //   catProfile: 'https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/CAT%20%2314',
    // },
  ];
}

decorate(CatStore, {
  addCatAddress: observable,
  addCatLocation: observable,
  addCatPhotoPath: observable,
  addCatNickname: observable,
  addCatDescription: observable,
  addCatSpecies: observable,
  addCatCut: observable,
  addCatUri: observable,
  addCatCutClicked: observable,
  selectedCatBio: observable,
  selectedCatToday: observable,
  selectedCatNewTag: observable,
  selectedCatPost: observable,
  selectedCatInputContent: observable,
  selectedCatCommentList: observable,
  selectedCatInputComment: observable,
  selectedCatAlbum: observable,
  selectedCatUri: observable,
  selectedCatPhoto: observable,
  selectedCatPhotoPath: observable,
  selectedCatFollowerList: observable,
  selectedCatRainbowOpen: observable,
  selectedCatRainbowYReported: observable,
  selectedCatRainbowNReported: observable,
  selectedCatCutClicked: observable,
  selectedCatReportInfo: observable,
  markers: observable,
  carousels: observable,
  getSelectedCatInfo: action,
  followCat: action,
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
  getCommentList: action,
  addComment: action,
  getAlbums: action,
  selectPhoto: action,
  getFollowerList: action,
  setCatPost: action,
});

export default CatStore;
