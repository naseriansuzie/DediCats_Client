import { observable, action, computed } from 'mobx';

/**
 * 1. isSignUp, email, nickName, PW(확인용은 Native Base 확인 후)
 * 2. isSignIn, email, PW(확인용은 Native Base 확인 후)
 * 3. myInfo = {로그인할 때 응답으로 오는 데이터 객체}
 * 4. myCatList = [{내가 팔로우하는 고양이 정보}]
 * 5. unfollowedCat = {고양이정보(catID)}
 * 6. myPhoto = 업로드할 이미지 파일
 * 7. defaultPhoto = 기본 이미지 파일
 * 8. inputPW = 새 PW 인풋(확인용은 Native Base 확인 후)
 */
export default class UserStore {

}
