'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { uiConfirm, uiAlert, uiError } from '@kma/utils';
import { useCommonCode, useUserProfile } from '@kma/comn';
import { CodeMasterGridWidget } from '@/widgets/system/ui/CodeMasterGridWidget';
import { CodeDetailGridWidget } from '@/widgets/system/ui/CodeDetailGridWidget';
import { comnUpsert, comnBatchDelete } from '@/entities/system/api/commonCodeApi';

export function CommonCodePage() {
  const { loadCodes } = useCommonCode();
  const { profile } = useUserProfile();
  const [masterList, setMasterList] = useState<any[]>([]);
  const [detailList, setDetailList] = useState<any[]>([]);
  const [selectedUpCd, setSelectedUpCd] = useState<string | null>(null);

  const refreshMaster = useCallback(
    async (force = false) => {
      try {
        const data = await loadCodes('', force);
        setMasterList(data.map((it: any) => ({ ...it, selected: false, inEdit: false })));
      } catch (e: any) {
        uiError('마스터 로드 실패', e.message);
      }
    },
    [loadCodes],
  );

  const refreshDetail = useCallback(
    async (upCd: string, force = false) => {
      if (!upCd || upCd.startsWith('TEMP_')) {
        setDetailList([]);
        return;
      }
      try {
        const data = await loadCodes(upCd, force);
        setDetailList((data || []).map((it: any) => ({ ...it, selected: false, inEdit: false })));
      } catch (e: any) {
        uiError('디테일 로드 실패', e.message);
      }
    },
    [loadCodes],
  );

  useEffect(() => {
    refreshMaster();
  }, [refreshMaster]);

  useEffect(() => {
    if (selectedUpCd && !selectedUpCd.startsWith('TEMP_')) {
      refreshDetail(selectedUpCd, false);
    } else {
      setDetailList([]);
    }
  }, [selectedUpCd, refreshDetail]);

  const handleRowClick = useCallback((cd: string) => {
    setSelectedUpCd(cd);
  }, []);

  const handleAddMaster = useCallback(() => {
    const tempCd = `TEMP_${Date.now()}`;
    setMasterList((prev) => [
      {
        comnCd: tempCd,
        comnNm: '',
        sort: prev.length + 1,
        inEdit: true,
        selected: false,
        upCd: null,
        comnDiv: '',
      },
      ...prev,
    ]);
  }, []);

  const handleAddDetail = useCallback(() => {
    const tempCd = `TEMP_${Date.now()}`;
    setDetailList((prev) => [
      {
        comnCd: tempCd,
        comnNm: '',
        sort: prev.length + 1,
        inEdit: true,
        selected: false,
        upCd: selectedUpCd,
      },
      ...prev,
    ]);
  }, [selectedUpCd]);

  const handleSave = async (type: 'master' | 'detail') => {
    const list = type === 'master' ? masterList : detailList;
    const targets = list.filter((it) => it.inEdit);
    if (targets.length === 0) return uiAlert('알림', '수정된 항목이 없습니다.');
    if (targets.some((t) => !t.comnNm.trim())) return uiAlert('알림', '코드명을 입력해주세요.');
    if (!(await uiConfirm('코드 저장', '변경사항을 저장하시겠습니까?'))) return;

    try {
      for (const target of targets) {
        const payload = { ...target, regId: profile?.id, modId: profile?.id };
        if (payload.comnCd.startsWith('TEMP_')) payload.comnCd = '';
        await comnUpsert(payload);
      }

      // 알림 창을 띄운 후 확인을 누르면 다음 리프레시 로직으로 진행
      await uiAlert('성공', '정상적으로 저장되었습니다.');

      // 비동기 실행을 위해 await 추가 및 selectedUpCd 유효성 체크
      if (type === 'master') {
        await refreshMaster(true);
      } else if (selectedUpCd) {
        await refreshDetail(selectedUpCd, true);
      }
    } catch (e: any) {
      uiError('저장 실패', e.message);
    }
  };

  const handleDelete = async (type: 'master' | 'detail') => {
    const list = type === 'master' ? masterList : detailList;
    const selectedItems = list.filter((it) => it.selected);
    if (selectedItems.length === 0) return uiAlert('알림', '삭제할 항목을 선택하세요.');
    if (!(await uiConfirm('코드 삭제', '삭제하시겠습니까?'))) return;

    const ids = selectedItems.map((it) => it.comnCd).filter((id) => !id.startsWith('TEMP_'));
    try {
      if (ids.length > 0) await comnBatchDelete(ids);
      await uiAlert('삭제 성공', '정상적으로 삭제되었습니다.');
      if (type === 'master') {
        setSelectedUpCd(null);
        await refreshMaster(true);
      } else if (selectedUpCd) {
        await refreshDetail(selectedUpCd, true);
      }
    } catch (e: any) {
      uiError('삭제 실패', e.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8 mt-6">공통코드 관리</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">그룹 코드 (Master)</h2>
        <CodeMasterGridWidget
          data={masterList}
          setData={setMasterList}
          selectedCd={selectedUpCd}
          onRowClick={handleRowClick}
          onAdd={handleAddMaster}
          onSave={() => handleSave('master')}
          onDelete={() => handleDelete('master')}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">상세 코드 (Detail)</h2>
        <CodeDetailGridWidget
          upCd={selectedUpCd}
          data={detailList}
          setData={setDetailList}
          onAdd={handleAddDetail}
          onSave={() => handleSave('detail')}
          onDelete={() => handleDelete('detail')}
        />
      </div>
    </div>
  );
}
