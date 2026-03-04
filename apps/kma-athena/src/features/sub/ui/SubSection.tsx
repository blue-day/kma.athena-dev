export function SubSection() {
  return (
    <section className="athena-card">
      <h2 style={{ marginTop: 0 }}>서브 화면 샘플</h2>
      <p style={{ marginBottom: 10, lineHeight: 1.6 }}>
        서브 화면은 독립 라우트(`/sub`)로 구성되어 있으며, 메인 레이아웃을 공유합니다.
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
        <li>views 계층에서 페이지 조립</li>
        <li>features 계층에서 기능 단위 컴포넌트 관리</li>
        <li>entities 계층에서 모델/도메인 데이터 정의</li>
      </ul>
    </section>
  );
}
