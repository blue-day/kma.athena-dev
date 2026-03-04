'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
// 리덕스 selector 제거 (kma-comn의 profile로 대체)
import { useAppDispatch } from '@/app/providers/hooks';
import { logout } from '@kma/auth';
import kmaLogo from '@/shared/assets/kma-logo.png';
import { uiAlert, uiConfirm } from '@kma/utils';
// 모든 사용자 정보 및 메뉴 비즈니스는 kma-comn에서 처리
import { useMenu, useUserProfile } from '@kma/comn';

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // 메뉴 정보와 사용자 프로필 정보를 라이브러리에서 직접 가져옴
  const { menu, fetchMenus } = useMenu();
  const { profile, loading } = useUserProfile();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = await uiConfirm(t('header.logout'), t('header.logout_confirm'));
    if (ok) {
      // 로그아웃 처리는 기존 auth 로직을 수행
      dispatch(logout());
      uiAlert(t('header.logout'), t('header.logout_done'));
      router.push('/auth/login');
    }
  };

  return (
    <header
      className="kma-topbar"
      onMouseLeave={() => setActiveMenuId(null)}
    >
      <div className="kma-topbar-inner">
        <div className="kma-header-top">
          <button
            className="kma-brand"
            type="button"
            onClick={() => router.push('/')}
          >
            <img
              className="kma-logo"
              src={kmaLogo.src}
              alt="KMA Logo"
            />
          </button>

          <div className="kma-util">
            {/* profile 객체의 존재 여부로 로그인 판단 */}
            {!loading && profile && (
              <div
                className="kma-user-profile"
                style={{
                  marginRight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#333',
                }}
              >
                <span style={{ fontWeight: 600 }}>{profile.name}</span>
                {profile.dept && <span style={{ marginLeft: '4px', color: '#666' }}>({profile.dept})</span>}
                <span style={{ marginLeft: '2px' }}>님</span>
              </div>
            )}

            {/* profile이 있으면 로그아웃, 없으면 로그인 버튼 노출 */}
            <button
              className="kma-linkbtn"
              onClick={profile ? handleLogout : () => router.push('/auth/login')}
            >
              {profile ? t('header.logout') : t('header.login')}
            </button>
          </div>
        </div>

        <div className="kma-header-bottom">
          <nav className="kma-nav">
            {menu.map((m) => (
              <div
                key={m.id}
                className={`kma-nav-item ${activeMenuId === m.id ? 'is-open' : ''}`}
                onMouseEnter={() => setActiveMenuId(m.id)}
              >
                <button
                  className="kma-nav-btn"
                  type="button"
                >
                  {t(`menu.${m.label}`, m.label)}
                </button>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {activeMenuId && (
        <div
          className="kma-mega-panel-full"
          onMouseEnter={() => setActiveMenuId(activeMenuId)}
          onMouseLeave={() => setActiveMenuId(null)}
        >
          <div className="kma-mega-container">
            {menu
              .find((m) => m.id === activeMenuId)
              ?.children?.map((sub) => (
                <div
                  key={sub.id}
                  className="kma-mega-group"
                >
                  <button
                    className="kma-mega-link"
                    onClick={() => {
                      if (sub.path && sub.path !== '/') {
                        const cleanPath = sub.path.replace(/^\/main/, '') || '/';
                        router.push(cleanPath);
                        setActiveMenuId(null);
                      } else {
                        uiAlert(t('header.alert_title'), t('header.ready'));
                      }
                    }}
                  >
                    {t(`menu.${sub.label}`, sub.label)}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
