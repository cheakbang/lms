import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDateTime, StarRating } from "../../Util/util";
import { apiGetCourseReviewByCourse } from "../../RestApi";

const Container = styled.div``;
const CourseReview = styled.div`
  display: flex;
  gap: 10px;
`;

export function UserCourseReview() {
  const { courseId } = useParams();
  const [courseReview, setCourseReview] = useState([]);

  // courseId로 courseReview 조회
  useEffect(() => {
    apiGetCourseReviewByCourse(courseId)
      .then((response) => {
        setCourseReview(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("컨텐츠 정보 불러오기 오류: ", error);
      });
  }, [courseId]);

  return (
    <>
      <Container>
        <h1>수강평</h1>
        {courseReview.map((review, index) => (
          <CourseReview key={index}>
            <p>{review.member.name}</p>
            <p>{formatDateTime(review.reviewDate)}</p>
            <p>{review.comment}</p>
            <StarRating averageRating={review.rating} />
          </CourseReview>
        ))}
      </Container>
    </>
  );
}
