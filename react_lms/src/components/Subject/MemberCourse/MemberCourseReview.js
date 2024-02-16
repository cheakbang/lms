import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { formatDateTime, StarRating } from "../../Util/util";
import { AuthContext } from "../../../AuthContext";
import { apiGetCourseReviewByCourse, apiPostCourseReview } from "../../RestApi";

const Container = styled.div``;
const ReviewBox = styled.div`
  border: 1px solid black;
`;
const InputBox = styled.form`
  display: flex;
  gap: 1rem;
  height: 30px;
  & input {
    flex: 1;
  }
`;
const Reviews = styled.table``;
const Review = styled.tr``;

export function MemberCourseReview() {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState(""); //수강평 내용
  const [rating, setRating] = useState(0); //별점

  // 해당 강의 리뷰 조회
  useEffect(() => {
    apiGetCourseReviewByCourse(courseId).then((response) => {
      setReviews(response.data.data);
    });
  }, [courseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiPostCourseReview({
      memberId: user.memberId,
      courseId: courseId,
      comment,
      rating,
    })
      .then(() => {
        setComment("");
        setRating(0);
        apiGetCourseReviewByCourse(courseId).then((response) => {
          setReviews(response.data.data);
        });
      })
      .catch((error) => {
        console.error("리뷰 생성 실패: ", error);
      });
  };

  return (
    <>
      <Container>
        <ReviewBox id="review">
          <p>
            <strong>수강평</strong>
          </p>
          <InputBox onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="다른 수강생들이 볼 수 있게 수강 후기와 별점을 남겨 주세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="0">별점 선택</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button type="submit">등록</button>
          </InputBox>
          <Reviews>
            <colgroup>
              <col style={{ width: 130 + "px" }} />
              <col style={{ width: 300 + "px" }} />
              <col style={{ width: 130 + "px" }} />
              <col style={{ width: 130 + "px" }} />
            </colgroup>
            {reviews.map((review, index) => (
              <Review key={index}>
                <td className="name">{review.member.name}</td>
                <td className="reviewText">{review.comment}</td>
                <td className="starRating">{review.rating}</td>
                <td className="time">{formatDateTime(review.reviewDate)}</td>
              </Review>
            ))}
          </Reviews>
        </ReviewBox>
      </Container>
    </>
  );
}
