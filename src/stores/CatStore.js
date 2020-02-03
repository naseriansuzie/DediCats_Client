import { observable, action, computed } from 'mobx';

/**
 * 1. 팔로우하는 고양이 수
 * 2. addCatBio = {
 *   img: fileName,
 *   name: string,
 *   desc: string,
 *   species: string,
 *   tagInput: string,
 *   tags: array,
 *   cut: {Y: number, N: number, unknown: number}
 * }
 * 3. spotList = [
 *    {bounds안 고양이 위치정보}
 * ]
 * 4. selectedCat = {선택한 고양이에대한 bio}
 * // 팔로우 하는지 확인하려면 사실 boolean(isFollowing)값을 테이블에 추가해서 보내주는게 나음
 * // 몇 명이 팔로우하는지 계산해서 보내주면 더 좋음
 * 5. postList = [{각 포스트에 관한 정보}]
 * 6. selectedPost = 5번의 객체 하나 -> {}
 * 7  inputContent = string (post의 내용)
 * 8  inputPhoto = data (post의 사진)
 * 9. commentList = [{6번 기준 달린 댓글들}]
 * 10. inputComment = string (댓글 내용)
 * 11. album = [{해당 postId에 따른 사진 정보들}]
 * 12. followerList = [{해당 catId에 따른 follower들}]
 * 13. reportInfo = {신고할 (postId || commentId || catId) && criminalId (userId?)}
 */
export default class CatStore {

}
