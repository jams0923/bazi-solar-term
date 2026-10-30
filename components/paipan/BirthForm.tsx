'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { birthCities as cities } from '@/data/cities';
import { localTimeOptions, resolveBirth, solarInputDate } from '@/lib/birthTime';
import type { ChartFormInput } from '@/types/bazi';
import { readBirthSession, restoreBirthSession, writeBirthSession } from '@/lib/birthSession';
export const emptyBirth: ChartFormInput = {
  gender: 'other',
  birthDate: '',
  birthTime: '',
  birthPlace: '台北',
  cityId: 'taipei',
  calendarType: 'solar',
  includeSolarTerm: true,
  dayRollover: '00:00',
  leapRule: 'split',
};
export default function BirthForm({
  mode,
  onCalculate,
}: {
  mode: 'bazi' | 'ziwei';
  onCalculate: (input: ChartFormInput) => void;
}) {
  const [form, setForm] = useState<ChartFormInput>({
    ...emptyBirth,
    dayRollover: mode === 'ziwei' ? '23:00' : '00:00',
  });
  const [manual, setManual] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const saved = readBirthSession();
    if (saved) {
      setForm((previous) => restoreBirthSession(previous, saved, mode));
      setManual(saved.manual);
      setRestored(true);
    }
    setReady(true);
  }, [mode]);
  useEffect(() => {
    if (ready) writeBirthSession(form, manual, mode);
  }, [form, manual, mode, ready]);
  function change<K extends keyof ChartFormInput>(key: K, value: ChartFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  let options: ReturnType<typeof localTimeOptions> = [];
  let timeError = '';
  if (form.birthDate && form.birthTime)
    try {
      options = localTimeOptions(
        solarInputDate(form),
        form.birthTime,
        cities.find((c) => c.id === form.cityId)!.zone
      );
    } catch (e) {
      timeError = e instanceof Error ? e.message : '日期無效';
    }
  return (
    <div className="card birth-panel">
      <h2>{mode === 'bazi' ? '八字' : '紫微斗數'}出生資料</h2>
      <p className="text-muted">
        日期及時間請依出生地的當地鐘錶記錄填寫。切換八字或紫微時，出生資料會自動帶入；回到首頁會清除。資料僅保存在目前瀏覽器分頁，不放入網址或送至伺服器。各入口的換日、閏月與順逆設定分別保留。
      </p>
      {restored && <p className="timing-note" role="status">已帶入本次出生資料，請確認排盤設定後按「開始排盤」。</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            if (manual && form.offsetMinutes === undefined)
              throw new Error('請填入手動 UTC 時差。');
            const input = { ...form, offsetMinutes: manual ? form.offsetMinutes : undefined };
            resolveBirth(input);
            onCalculate(input);
            setError('');
          } catch (err) {
            setError(err instanceof Error ? err.message : '無法排盤');
          }
        }}
      >
        <div className="birth-grid">
          <label>
            姓名／暱稱（選填）
            <input
              value={form.name || ''}
              onChange={(e) => change('name', e.target.value)}
              autoComplete="off"
            />
          </label>
          <label>
            性別
            <select
              value={form.gender}
              onChange={(e) => {
                const gender = e.target.value as ChartFormInput['gender'];
                setForm((previous) => ({
                  ...previous,
                  gender,
                  ziweiGender: !previous.ziweiGender || previous.ziweiGender === previous.gender
                    ? (gender === 'other' ? undefined : gender)
                    : previous.ziweiGender,
                }));
              }}
            >
              <option value="other">不指定／其他</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>
          <label>
            曆法
            <select
              value={form.calendarType}
              onChange={(e) => {
                change('calendarType', e.target.value as 'solar' | 'lunar');
                change('leapMonth', false);
              }}
            >
              <option value="solar">國曆</option>
              <option value="lunar">農曆年月日</option>
            </select>
          </label>
          <label>
            出生日期
            {form.calendarType === 'solar' ? (
              <input
                required
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                value={form.birthDate}
                onChange={(e) => {
                  change('birthDate', e.target.value);
                  change('disambiguation', undefined);
                }}
              />
            ) : (
              <input
                required
                placeholder="YYYY-MM-DD，例如農曆七月十五填 07-15"
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                value={form.birthDate}
                onChange={(e) => {
                  change('birthDate', e.target.value);
                  change('disambiguation', undefined);
                }}
              />
            )}
          </label>
          <label>
            出生時間（24 小時制）
            <input
              required
              type="time"
              step="60"
              value={form.birthTime}
              onChange={(e) => {
                change('birthTime', e.target.value);
                change('disambiguation', undefined);
              }}
            />
          </label>
          <label>
            出生城市
            <select
              value={form.cityId}
              onChange={(e) => {
                const city = cities.find((c) => c.id === e.target.value)!;
                setForm((prev) => ({
                  ...prev,
                  cityId: city.id,
                  birthPlace: city.name,
                  timeZone: city.zone,
                  disambiguation: undefined,
                }));
              }}
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.country} · {city.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            日柱／農曆換日約定
            <select
              value={form.dayRollover}
              onChange={(e) => change('dayRollover', e.target.value as '00:00' | '23:00')}
            >
              <option value="00:00">00:00 換日（晚子時仍當日）</option>
              <option value="23:00">23:00 換日（晚子時次日）</option>
            </select>
          </label>
          {form.calendarType === 'lunar' && (
            <label className="check-label">
              <input
                type="checkbox"
                checked={!!form.leapMonth}
                onChange={(e) => change('leapMonth', e.target.checked)}
              />
              此月為閏月
            </label>
          )}
          {mode === 'ziwei' && (
            <>
              <label>
                閏月安宮約定
                <select
                  value={form.leapRule}
                  onChange={(e) => change('leapRule', e.target.value as 'split' | 'same')}
                >
                  <option value="split">十五日前本月、十六日起下月</option>
                  <option value="same">全月沿用本月</option>
                </select>
              </label>
              <label>
                傳統大限順逆規則
                <select
                  required
                  value={form.ziweiGender || ''}
                  onChange={(e) => change('ziweiGender', e.target.value as 'male' | 'female')}
                >
                  <option value="" disabled>
                    請選擇排盤規則
                  </option>
                  <option value="male">傳統男命規則</option>
                  <option value="female">傳統女命規則</option>
                </select>
              </label>
            </>
          )}
        </div>
        {form.birthDate && form.birthTime && (
          <div className="timing-note" role="status">
            {timeError ||
              (!options.length
                ? '城市時區下此鐘錶時間不存在（跳時／跳日），請更正；手動時差可明確改採固定時差。'
                : options.map((o, i) => (
                    <div key={o.toString()}>
                      {options.length > 1 ? `第 ${i + 1} 次：` : '出生當時：'}UTC{o.offset} ·{' '}
                      {o.toInstant().toString()}
                    </div>
                  )))}
            {options.length > 1 && !manual && (
              <label>
                重複時間選擇
                <select
                  required
                  value={form.disambiguation || ''}
                  onChange={(e) => change('disambiguation', e.target.value as 'earlier' | 'later')}
                >
                  <option value="" disabled>
                    必須明確選擇
                  </option>
                  <option value="earlier">第一次（較早瞬間）</option>
                  <option value="later">第二次（較晚瞬間）</option>
                </select>
              </label>
            )}
          </div>
        )}
        <details>
          <summary>進階：手動時差與真太陽時</summary>
          <label className="check-label">
            <input
              type="checkbox"
              checked={manual}
              onChange={(e) => {
                setManual(e.target.checked);
                if (e.target.checked && form.offsetMinutes === undefined)
                  change(
                    'offsetMinutes',
                    options[0]?.offsetNanoseconds ? options[0].offsetNanoseconds / 60e9 : 480
                  );
              }}
            />
            使用手動 UTC 時差（覆蓋歷史時區）
          </label>
          {manual && (
            <label>
              UTC 時差分鐘（+08:00 = 480）
              <input
                required
                type="number"
                min="-840"
                max="840"
                step="any"
                value={form.offsetMinutes ?? ''}
                onChange={(e) =>
                  change(
                    'offsetMinutes',
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
              />
            </label>
          )}
          <label className="check-label">
            <input
              type="checkbox"
              checked={!!form.trueSolarTime}
              onChange={(e) => change('trueSolarTime', e.target.checked)}
            />
            真太陽時（自動使用城市中心經度＋均時差估算）
          </label>
          <p className="text-muted">
            未啟用真太陽時會採當地鐘錶時（含夏令時間）排日／時柱。真太陽時只調整日／時柱和紫微時辰；立春與節的切換依真實出生瞬間。1970
            年前歷史時區資料可能不完整，請核對出生紀錄。出生城市未收錄時，請先選相近時區城市並手動修正時差，勿啟用真太陽時。
          </p>
        </details>
        {mode === 'bazi' && (
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.includeSolarTerm}
              onChange={(e) => change('includeSolarTerm', e.target.checked)}
            />
            包含節氣解讀
          </label>
        )}
        {error && (
          <p role="alert" className="error-note">
            {error}
          </p>
        )}
        <div className="action-row">
          <button className="btn" type="submit">
            開始排盤
          </button>
          <Link className="btn btn-secondary" href={mode === 'bazi' ? '/ziwei' : '/paipan'}>
            切換至{mode === 'bazi' ? '紫微斗數' : '八字排盤'}
          </Link>
        </div>
      </form>
    </div>
  );
}
