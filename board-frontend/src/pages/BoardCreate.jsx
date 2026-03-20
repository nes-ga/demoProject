import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BoardCreate() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {

        await fetch("http://localhost:8080/boards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        });

        alert("작성 완료");

        navigate("/");
    };

    return (
        <div>
            <h1>게시글 작성</h1>

            <input
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br/>

            <textarea
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <br/>

            <button onClick={handleSubmit}>
                작성
            </button>
        </div>
    );
}