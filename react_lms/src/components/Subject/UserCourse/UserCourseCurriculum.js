import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import { apiGetContentByCourse } from "../../RestApi";
import { formatTime } from "../../Util/util";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../AuthContext";

const Container = styled.div`
  .content.completed {
    background-color: #f3f3f3;
    & .text {
      color: #3182f6;
    }
  }
`;

export function UserCourseCurriculem() {
  const { courseId } = useParams();
  const [content, setContent] = useState([]);
  const [completedContents, setCompletedContents] = useState([]);
  const [exam, setExam] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  // 컨텐츠 히스토리 조회
  const { user } = useContext(AuthContext);

  // 해당 코스 컨텐츠 조회
  useEffect(() => {
    apiGetContentByCourse(courseId)
      .then((response) => {
        setContent(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("컨텐츠 정보 불러오기 오류: ", error);
      });
  }, [courseId]);

  return (
    <>
      <Container>
        <h2 className="title">
          커리큘럼
          <span className="contentInfo">
            {" "}
            총 {content?.length || 0}개,{" "}
            {formatTime(
              content?.reduce(
                (acc, cur) => acc + (cur.course.durationMins || 0),
                0
              ) || 0
            )}
            의 수업
          </span>
        </h2>
        {content?.map((item, index) => {
          const isCompleted = completedContents.find(
            (history) => history.content.contentId === item.contentId
          );
          return <p>{item.contentTitle}</p>;
        })}
      </Container>
    </>
  );
}
