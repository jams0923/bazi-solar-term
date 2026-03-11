'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChartFormInput } from '@/types/bazi';

const defaultForm: ChartFormInput = {
  name: '',
  gender: 'male',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthPlace: '台灣 台北',
  calendarType: 'solar',
  includeSolarTerm: true,
};

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, '0')
);

const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);

function parseBirthTime(time: string) {
  const [hour = '12', minute = '00'] = (time || '12:00').split(':');
  return {
    hour: /^\d{2}$/.test(hour) ? hour : '12',
    minute: /^\d{2}$/.test(minute) ? minute : '00',
  };
}

function joinBirthTime(hour: string, minute: string) {
  return `${hour}:${minute}`;
}

function getShichenLabel(hourText: string, minuteText: string) {
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return {
      name: '—',
      range: '—',
      description: '',
    };
  }

  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 23 * 60 || totalMinutes < 1 * 60) {
    return {
      name: '子時',
      range: '23:00 ~ 00:59',
      description: '此區間對應子時',
    };
  }
  if (totalMinutes >= 1 * 60 && totalMinutes < 3 * 60) {
    return {
      name: '丑時',
      range: '01:00 ~ 02:59',
      description: '此區間對應丑時',
    };
  }
  if (totalMinutes >= 3 * 60 && totalMinutes < 5 * 60) {
    return {
      name: '寅時',
      range: '03:00 ~ 04:59',
      description: '此區間對應寅時',
    };
  }
  if (totalMinutes >= 5 * 60 && totalMinutes < 7 * 60) {
    return {
      name: '卯時',
      range: '05:00 ~ 06:59',
      description: '此區間對應卯時',
    };
  }
  if (totalMinutes >= 7 * 60 && totalMinutes < 9 * 60) {
    return {
      name: '辰時',
      range: '07:00 ~ 08:59',
      description: '此區間對應辰時',
    };
  }
  if (totalMinutes >= 9 * 60 && totalMinutes < 11 * 60) {
    return {
      name: '巳時',
      range: '09:00 ~ 10:59',
      description: '此區間對應巳時',
    };
  }
  if (totalMinutes >= 11 * 60 && totalMinutes < 13 * 60) {
    return {
      name: '午時',
      range: '11:00 ~ 12:59',
      description: '此區間對應午時',
    };
  }
  if (totalMinutes >= 13 * 60 && totalMinutes < 15 * 60) {
    return {
      name: '未時',
      range: '13:00 ~ 14:59',
      description: '此區間對應未時',
    };
  }
  if (totalMinutes >= 15 * 60 && totalMinutes < 17 * 60) {
    return {
      name: '申時',
      range: '15:00 ~ 16:59',
      description: '此區間對應申時',
    };
  }
  if (totalMinutes >= 17 * 60 && totalMinutes < 19 * 60) {
    return {
      name: '酉時',
      range: '17:00 ~ 18:59',
      description: '此區間對應酉時',
    };
  }
  if (totalMinutes >= 19 * 60 && totalMinutes < 21 * 60) {
    return {
      name: '戌時',
      range: '19:00 ~ 20:59',
      description: '此區間對應戌時',
    };
  }

  return {
    name: '亥時',
    range: '21:00 ~ 22:59',
    description: '此區間對應亥時',
  };
}

export default function ChartForm() {
  const router = useRouter();
  const [form, setForm] = useState<ChartFormInput>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedTime = useMemo(() => parseBirthTime(form.birthTime), [form.birthTime]);

  const shichenInfo = useMemo(
    () => getShichenLabel(parsedTime.hour, parsedTime.minute),
    [parsedTime.hour, parsedTime.minute]
  );

  const timeHint = useMemo(
    () => '請直接選擇 24 小時制時間，例如 00:30、08:15、13:40、23:10',
    []
  );

  function updateField<K extends keyof ChartFormInput>(key: K, value: ChartFormInput[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateBirthHour(hour: string) {
    updateField('birthTime', joinBirthTime(hour, parsedTime.minute));
  }

  function updateBirthMinute(minute: string) {
    updateField('birthTime', joinBirthTime(parsedTime.hour, minute));
  }

  function buildQueryString(data: ChartFormInput) {
    const params = new URLSearchParams();
    params.set('name', data.name || '');
    params.set('gender', data.gender);
    params.set('birthDate', data.birthDate);
    params.set('birthTime', data.birthTime);
    params.set('birthPlace', data.birthPlace);
    params.set('calendarType', data.calendarType);
    params.set('includeSolarTerm', String(data.includeSolarTerm));
    return params.toString();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.birthDate || !form.birthTime) return;

    setIsSubmitting(true);

    const query = buildQueryString(form);
    router.push(`/result?${query}`);
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-head-inline" style={{ marginBottom: 18 }}>
        <h2 className="title-lg" style={{ marginBottom: 0 }}>
          排盤資料輸入
        </h2>
        <span className="badge">24 小時制</span>
      </div>

      <p
        className="text-muted"
        style={{
          marginTop: 0,
          marginBottom: 18,
          lineHeight: 1.9,
        }}
      >
        為避免上午／下午在 12 點時發生混淆，出生時間已統一改為 24 小時制下拉選單。
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-muted">姓名</span>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="請輸入姓名"
              className="input"
              style={darkInputStyle}
            />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-muted">性別</span>
            <select
              value={form.gender}
              onChange={(e) =>
                updateField('gender', e.target.value as ChartFormInput['gender'])
              }
              className="input"
              style={darkInputStyle}
            >
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-muted">出生日期</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => updateField('birthDate', e.target.value)}
              className="input"
              style={darkInputStyle}
            />
          </label>

          <div style={{ display: 'grid', gap: 8 }}>
            <span className="text-muted">出生時間</span>

            <div
              style={{
                display: 'grid',
                gap: 10,
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
              }}
            >
              <select
                value={parsedTime.hour}
                onChange={(e) => updateBirthHour(e.target.value)}
                className="input"
                style={timeSelectStyle}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} 時
                  </option>
                ))}
              </select>

              <span
                style={{
                  color: 'rgba(240, 232, 214, 0.72)',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                :
              </span>

              <select
                value={parsedTime.minute}
                onChange={(e) => updateBirthMinute(e.target.value)}
                className="input"
                style={timeSelectStyle}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute} 分
                  </option>
                ))}
              </select>
            </div>

            <span
              style={{
                fontSize: 12,
                color: 'rgba(240, 232, 214, 0.62)',
                lineHeight: 1.6,
              }}
            >
              {timeHint}
            </span>

            <div
              style={{
                marginTop: 4,
                borderRadius: 12,
                border: '1px solid rgba(231, 194, 125, 0.18)',
                background:
                  'linear-gradient(180deg, rgba(231,194,125,0.10) 0%, rgba(231,194,125,0.04) 100%)',
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f5e7c3',
                  marginBottom: 4,
                }}
              >
                目前對應時辰：{shichenInfo.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: 'rgba(240, 232, 214, 0.76)',
                }}
              >
                區間：{shichenInfo.range}
              </div>
            </div>
          </div>
        </div>

        <label style={{ display: 'grid', gap: 8 }}>
          <span className="text-muted">出生地</span>
          <input
            value={form.birthPlace}
            onChange={(e) => updateField('birthPlace', e.target.value)}
            placeholder="例如：台灣 台北"
            className="input"
            style={darkInputStyle}
          />
        </label>

        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-muted">曆法</span>
            <select
              value={form.calendarType}
              onChange={(e) =>
                updateField('calendarType', e.target.value as ChartFormInput['calendarType'])
              }
              className="input"
              style={darkInputStyle}
            >
              <option value="solar">國曆</option>
              <option value="lunar">農曆</option>
            </select>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingTop: 30,
            }}
          >
            <input
              type="checkbox"
              checked={form.includeSolarTerm}
              onChange={(e) => updateField('includeSolarTerm', e.target.checked)}
            />
            <span className="text-muted">包含節氣分析</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={buttonStyle}
            disabled={isSubmitting}
          >
            {isSubmitting ? '產生命盤中…' : '開始排盤'}
          </button>
        </div>
      </form>
    </div>
  );
}

const darkInputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f5f1e8',
  padding: '12px 14px',
  outline: 'none',
};

const timeSelectStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#ffffff',
  color: '#000000',
  padding: '12px 14px',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 14,
  padding: '12px 18px',
  border: '1px solid rgba(231, 194, 125, 0.22)',
  background:
    'linear-gradient(180deg, rgba(231,194,125,0.16) 0%, rgba(231,194,125,0.08) 100%)',
  color: '#f5e7c3',
  fontWeight: 700,
  cursor: 'pointer',
};