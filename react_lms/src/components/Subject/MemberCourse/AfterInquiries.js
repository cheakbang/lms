import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { useState, useEffect, useContext } from "react";
import {
  apiGetCourse,
  apiGetQnABoardsByCourse,
  apiCreateQnABoard,
  apiGetQnARepliesByQnABoardId,
} from "../../RestApi";
import { formatDateTime } from "../../Util/util";

const Container = styled.div``;
const InputBox = styled.form``;
const Input = styled.input`
  width: 25%;
`;
const QnAs = styled.table``;
const QnA = styled.tr``;

export function AfterInquiries() {
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [qnas, setQnas] = useState([]);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState({});
  const [questionText, setQuestionText] = useState("");

  // 해당 강의 조회
  useEffect(() => {
    apiGetCourse(courseId)
      .then((response) => {
        setCourse(response.data.data);
      })
      .catch((error) => {
        console.error("코스 정보 불러오기 오류: ", error);
      });
  }, [courseId]);

  // 질문 작성
  const handleSubmit = (e) => {
    e.preventDefault();
    apiCreateQnABoard({
      memberId: user.memberId,
      courseId: courseId,
      questionText,
    })
      .then(() => {
        setQuestionText("");
        apiGetQnABoardsByCourse(courseId).then((response) => {
          setQnas(response.data.data);
        });
      })
      .catch((error) => {
        console.error("질문 등록 실패: ", error);
      });
  };

  // 해당 강의 질문 조회
  useEffect(() => {
    apiGetQnABoardsByCourse(courseId).then((response) => {
      const fetchedQnas = response.data.data;
      setQnas(fetchedQnas);
      // 각 질문에 대한 답변을 불러옵니다.
      fetchedQnas.forEach((qna) => {
        // 답변 불러오기
        apiGetQnARepliesByQnABoardId(qna.qnaId)
          .then((response) => {
            setReplies((prevReplies) => ({
              ...prevReplies,
              [qna.qnaId]: response.data.data,
            })); // 답변 데이터를 상태에 저장
          })
          .catch((error) => {
            console.error("답변 조회 실패: ", error);
          });
        // 답변 보여주는 상태를 false로 초기화합니다.
        setShowReplies((prevShowReplies) => ({
          ...prevShowReplies,
          [qna.qnaId]: false,
        }));
      });
    });
  }, [courseId]);

  // 질문에 대한 답변 불러오기
  function handleLoadReplies(qnaId) {
    // 답변이 이미 불러와져 있고, 답변을 보여주는 상태라면 답변을 숨김
    if (showReplies[qnaId]) {
      setShowReplies((prevShowReplies) => ({
        ...prevShowReplies,
        [qnaId]: false,
      }));
    } else {
      // 아직 답변이 불러와지지 않았다면 답변을 불러온 후, 답변 보여주는 상태를 true로 설정
      if (!replies[qnaId]) {
        apiGetQnARepliesByQnABoardId(qnaId)
          .then((response) => {
            setReplies((prevReplies) => ({
              ...prevReplies,
              [qnaId]: response.data.data,
            })); // 답변 데이터를 상태에 저장
          })
          .catch((error) => {
            console.error("답변 조회 실패: ", error);
          });
      }
      setShowReplies((prevShowReplies) => ({
        ...prevShowReplies,
        [qnaId]: true,
      })); // 답변을 보여주는 상태를 true로 설정
    }
  }

  return (
    <>
      <Container>
        <p>강의 내용에 대해 자유롭게 질문해 주세요 </p>
        <InputBox onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="강의에 대한 질문을 남겨 주세요."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <button type="submit">등록</button>
        </InputBox>
        <QnAs>
          {qnas.map((qna, index) => (
            <React.Fragment key={index}>
              <QnA>
                <td className="name">{qna.member.name}</td>
                <td className="reviewText">
                  Q: {qna.questionText}
                  {replies[qna.qnaId] && replies[qna.qnaId].length > 0 ? (
                    <button onClick={() => handleLoadReplies(qna.qnaId)}>
                      {showReplies[qna.qnaId] ? "답변 닫기" : "답변 보기"}
                    </button>
                  ) : (
                    <p>답변 기다리는 중</p>
                  )}
                </td>
                <td className="time">{formatDateTime(qna.createdAt)}</td>
              </QnA>
              {showReplies[qna.qnaId] && (
                <QnA>
                  {replies[qna.qnaId] &&
                    replies[qna.qnaId].map((reply) => (
                      <p key={reply.replyId}>
                        A: {reply.replyText}
                        {reply.member && ` by ${reply.member.name}`}
                      </p>
                    ))}
                </QnA>
              )}
            </React.Fragment>
          ))}
        </QnAs>
      </Container>
    </>
  );
}
