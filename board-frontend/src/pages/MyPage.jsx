import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import AuthControls from "../components/AuthControls";

export default function MyPage() {
    const { currentUser } = useAuth();
    const location = useLocation();
    const passwordChanged = location.state?.passwordChanged === true;

    return (
        <div className="page-shell">
            <section className="board-page detail-page">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">My Page</p>
                        <h1>마이페이지</h1>
                        <p className="page-description">
                            본인 계정을 확인하고 계정 관련 설정 화면으로 이동할 수 있습니다.
                        </p>
                    </div>
                    <AuthControls />
                </div>

                {passwordChanged ? (
                    <div className="empty-state success-state">비밀번호가 변경되었습니다.</div>
                ) : null}

                <section className="profile-card">
                    <h2>내 정보</h2>
                    <div className="profile-grid">
                        <div>
                            <span className="profile-label">아이디</span>
                            <strong>{currentUser?.username}</strong>
                        </div>
                        <div>
                            <span className="profile-label">권한</span>
                            <strong>{currentUser?.role}</strong>
                        </div>
                    </div>
                </section>

                <section className="profile-card">
                    <h2>계정 설정</h2>
                    <div className="inline-actions">
                        <Link className="secondary-button settings-link-button" to="/mypage/password">
                            비밀번호 변경
                        </Link>
                        <Link className="back-link" to="/">목록으로 돌아가기</Link>
                    </div>
                </section>
            </section>
        </div>
    );
}
