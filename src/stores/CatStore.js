import { observable, action, decorate, runInAction } from 'mobx';
import axios from 'axios';
import { SERVER_URL, KAKAO_MAPS_API_KEY } from 'react-native-dotenv';
import { Alert } from 'react-native';

const defaultCredential = { withCredentials: true };
class CatStore {
  constructor(root) {
    this.root = root;
  }

  // 등록할 주소
  addCatAddress = '';

  // 등록할 위치
  addCatLocation = { latitude: 0, longitude: 0 };

  // 마커 이동 확인
  onDragstate = false;

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

  // post를 수정하는 중인지 상태 - true면 수정 중
  postModifyState = false;

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

  // CatStore
  setCatPost = item => {
    const { comment } = this.root;
    this.selectedCatPost = item;
    comment.initialComments = item.comments.length;
    comment.connectSocket();
  };

  //! catId, catNickname, catAddress, latitude, longitude, description, catProfile

  getSelectedCatInfo = async (catId, navigation) => {
    const result = await axios
      .get(`${SERVER_URL}/cat/${catId}`, defaultCredential)
      .then(res => {
        if (res.data[0].todayTime) {
          // Helper Store
          res.data[0].todayTime = this.root.helper.changeToDateTime(
            res.data[0].todayTime,
          );
        }
        if (res.data[0].rainbow) {
          res.data[0].rainbow = JSON.parse(res.data[0].rainbow);
        }
        res.data[0].cut = JSON.parse(res.data[0].cut);
        this.selectedCatBio = res.data;
        console.log(
          '이 고양이 팔로우 중인가요?',
          this.selectedCatBio[1].isFollowing,
        );
        return true;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
        return false;
      });
    return result;
  };

  // CatStore
  followCat = (catId, navigation) => {
    const { map, user, auth } = this.root;
    axios
      .post(`${SERVER_URL}/cat/follow/`, { catId }, defaultCredential)
      .then(res => {
        this.getSelectedCatInfo(catId);
        this.getFollowerList(catId, navigation);
        map.getMapInfo(navigation);
        user.getMyCatList(navigation);
      })
      .catch(err => {
        auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
  };

  // CatStore
  selectCut = (variable, type) => {
    if (variable === 'addCat') {
      this[`${variable}Cut`] = { Y: 0, N: 0, unknown: 0 };
    }
    // this[variable].cut = { Y: 0, N: 0, unknown: 0 };
    runInAction(() => {
      const keys = Object.keys(this[`${variable}CutClicked`]);
      const values = Object.values(this[`${variable}CutClicked`]);
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
      if (variable === 'addCat') {
        runInAction(() => {
          this[`${variable}Cut`][type] = 1;
        });
      }
    });
  };

  // CatStore
  validateAddCat = () => {
    let isValidated = false;
    const {
      addCatLocation,
      addCatNickname,
      addCatDescription,
      addCatSpecies,
      addCatCutClicked,
      onDragstate,
      addCatPhotoPath,
    } = this;
    if (!onDragstate) {
      Alert.alert('고양이 마커를 움직여 주세요.');
      return isValidated;
    }
    if (
      addCatPhotoPath &&
      addCatLocation &&
      addCatNickname.length &&
      addCatDescription.length &&
      addCatSpecies.length &&
      (addCatCutClicked.Y || addCatCutClicked.N || addCatCutClicked.unknown)
    ) {
      this.onDragstate = false;
      isValidated = true;
    } else Alert.alert('고양이 위치를 포함한 모든 정보를 입력해주세요.');
    return isValidated;
  };

  // MapStore
  getAddress = async () => {
    const { latitude, longitude } = this.addCatLocation;
    console.log('카카오로 보낼 좌표', latitude, longitude);
    const address = await axios
      .get(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_MAPS_API_KEY}`,
          },
        },
      )
      .then(res => {
        const {
          region_1depth_name,
          region_2depth_name,
          region_3depth_name,
        } = res.data.documents[0].address;
        console.log(
          '받은 주소는',
          region_1depth_name,
          region_2depth_name,
          region_3depth_name,
        );
        this.addCatAddress = `${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`;
        return true;
      })
      .catch(err => {
        console.dir(err);
        Alert.alert('좌표가 정확하지 않습니다. 다시 지도에서 선택해주세요!');
        return false;
      });
    return address;
  };

  // CatStore
  addCat = async navigation => {
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
      .then(res => {
        Alert.alert('등록에 성공하였습니다!');
        this.root.helper.clearAddCatBio('addCatBio');
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          Alert.alert('고양이를 등록할 수 없습니다');
        } else {
          this.root.auth.expiredTokenHandler(err, navigation);
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
  reportRainbow = async (type, navigation) => {
    const catId = this.selectedCatBio[0].id;
    console.log(catId);
    const rainbow = {
      Y: 0,
      YDate: null,
      N: 0,
      NDate: null,
    };
    console.log(rainbow);
    rainbow[type] = 1;
    console.log(rainbow[type]);
    rainbow[`${type}Date`] = this.root.helper.makeDateTime();
    console.log(rainbow[`${type}Date`]);
    console.log(rainbow);
    console.log({ catId, rainbow });
    const result = axios
      .post(`${SERVER_URL}/cat/rainbow`, { catId, rainbow }, defaultCredential)
      .then(res => {
        this.selectedCatBio[0].rainbow = JSON.parse(res.data.rainbow);
        return res.data;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
    return result;
  };

  // CatStore
  disableReportBtn = type => {
    this[`selectedCatRainbow${type}Reported`] = !this[
      `selectedCatRainbow${type}Reported`
    ];
  };

  // CatStore
  postCut = (type, navigation) => {
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
          } else {
            this.root.auth.expiredTokenHandler(err, navigation);
            console.dir(err);
          }
        });
    });
  };

  // CatStore
  postCatToday = (value, navigation) => {
    const catId = this.selectedCatBio[0].id;
    this.selectedCatToday = value;
    const todayInfo = {
      catToday: value,
      catId,
    };
    runInAction(() => {
      axios
        .post(`${SERVER_URL}/cat/addcatToday`, todayInfo, defaultCredential)
        .then(res => {
          this.getSelectedCatInfo(catId);
        })
        .catch(err => {
          if (err.response && err.response.status === 409) {
            Alert.alert('오늘의 건강 상태 등록에 실패했습니다.');
            this.selectedCatToday = undefined;
          } else {
            this.root.auth.expiredTokenHandler(err, navigation);
            console.dir(err);
          }
        });
    });
  };

  // CatStore
  validateTag = navigation => {
    const { selectedCatNewTag } = this;
    const tags = this.selectedCatBio[2].map(tagInfo => tagInfo.tag.content);
    if (tags.includes(selectedCatNewTag)) {
      Alert.alert('이미 존재하는 태그입니다!');
      this.root.helper.clearInput('cat', 'selectedCatNewTag');
    } else {
      this.postTag(selectedCatNewTag, navigation);
    }
  };

  // CatStore
  postTag = (newTag, navigation) => {
    const catId = this.selectedCatBio[0].id;
    axios
      .post(
        `${SERVER_URL}/cat/updateTag`,
        { catTag: newTag, catId },
        defaultCredential,
      )
      .then(res => {
        const tags = this.selectedCatBio[2];
        tags.push(res.data);
        runInAction(() => {
          this.root.helper.clearInput('cat', 'selectedCatNewTag');
        });
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
  };

  getAlbums = navigation => {
    const catId = this.selectedCatBio[0].id;
    axios
      .get(`${SERVER_URL}/photo/album/${catId}`, defaultCredential)
      .then(res => {
        const photos = res.data.filter(
          photo => photo.path !== this.selectedCatBio[3].path,
        );
        this.selectedCatAlbum = photos;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
  };

  selectPhoto = photo => {
    this.selectedCatPhoto = photo;
  };

  getFollowerList = (catId, navigation) => {
    axios
      .get(`${SERVER_URL}/cat/follower/${catId}`, defaultCredential)
      .then(res => {
        this.selectedCatFollowerList = res.data;
      })
      .catch(err => {
        this.root.auth.expiredTokenHandler(err, navigation);
        console.dir(err);
      });
  };
}

decorate(CatStore, {
  addCatAddress: observable,
  addCatLocation: observable,
  onDragstate: observable,
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
  postModifyState: observable,
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
  setCatPost: action,
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
  getAlbums: action,
  selectPhoto: action,
  getFollowerList: action,
});

export default CatStore;
