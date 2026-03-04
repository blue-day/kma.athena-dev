'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { DateRange, MemberType, MemberSearchFilter } from '@kma/api-interface';
import { uiError } from '@kma/utils';
import { memberList as memberListApi } from '@/entities/member/api/memberApi';
import { MemberListWidget } from '@/widgets/member/ui/MemberListWidget';

export function MembersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialFilter = useCallback((): MemberSearchFilter => {
    const startDate = searchParams?.get('startDate');
    const endDate = searchParams?.get('endDate');

    const baseFilter: MemberSearchFilter = {
      page: Number(searchParams?.get('page') || 1),
      keyword: searchParams?.get('keyword') || '',
      areaCd: searchParams?.get('areaCd') || '',
      payDiv: searchParams?.get('payDiv') || '',
      boardDiv: searchParams?.get('boardDiv') || '',
      dateRange: null,
    };

    try {
      if (startDate && endDate) {
        baseFilter.dateRange = {
          start: parseDate(startDate),
          end: parseDate(endDate),
        } as DateRange;
      }
    } catch (e) {
      console.error('Date parsing failed', e);
    }

    return baseFilter;
  }, [searchParams]);

  const [filter, setFilter] = useState<MemberSearchFilter>(getInitialFilter);
  const [memberList, setMemberList] = useState<MemberType[]>([]);
  const didInit = useRef(false);

  const handleFilterChange = (updates: Partial<MemberSearchFilter>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filter.page > 1) params.set('page', filter.page.toString());
    if (filter.keyword) params.set('keyword', filter.keyword);
    if (filter.areaCd) params.set('areaCd', filter.areaCd);
    if (filter.payDiv) params.set('payDiv', filter.payDiv);
    if (filter.boardDiv) params.set('boardDiv', filter.boardDiv);
    if (filter.dateRange?.start) params.set('startDate', filter.dateRange.start.toString());
    if (filter.dateRange?.end) params.set('endDate', filter.dateRange.end.toString());

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filter, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const loadData = useCallback(async () => {
    try {
      const resMemberList = await memberListApi(
        filter.keyword,
        filter.dateRange?.start?.toString(),
        filter.dateRange?.end?.toString(),
        filter.areaCd,
        filter.payDiv,
        filter.boardDiv,
      );
      setMemberList(resMemberList?.memberList || []);
    } catch (e: any) {
      uiError('조회 실패', e.message);
    }
  }, [filter]);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      loadData();
    }
  }, [loadData]);

  return (
    <div className="kma-page">
      <div className="kma-title">회원 목록</div>
      <div className="kma-divider" />
      <MemberListWidget
        memberList={memberList}
        filter={filter}
        onFilterChange={handleFilterChange}
        onSearchClick={() => {
          handleFilterChange({ page: 1 });
          loadData();
        }}
        onReset={() => {
          setFilter({ page: 1, keyword: '', areaCd: '', payDiv: '', boardDiv: '', dateRange: null });
          router.push('/members');
        }}
        onRowClick={(id) => router.push(`/members/${id}?${searchParams?.toString()}`)}
        onCreateClick={() => router.push(`/members/new?${searchParams?.toString()}`)}
      />
    </div>
  );
}
