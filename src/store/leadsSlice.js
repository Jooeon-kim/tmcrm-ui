import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../api/client.js";
import { toKstNowYmdHm } from "../utils/datetime.js";

export const fetchLeads = createAsyncThunk("leads/fetch", async (tm) => {
  const res = await client.get("", { params: { action: "leads", tm } });
  if (!res.data?.ok) throw new Error(res.data?.error || "fetch failed");
  return res.data.data || [];
});

export const saveLead = createAsyncThunk("leads/save", async (payload, { getState }) => {
  const tm = getState().auth.tm;

  // Apps Script에서 POST가 CORS/프리플라이트로 막히는 경우가 많아서
  // update도 GET 파라미터 방식으로 보냅니다.
  const params = {
    action: "update",
    tm,
    leadId: payload.leadId,
    eventType: payload.eventType,
    status: payload.status ?? "",
    memo: payload.memo ?? "",
    reservationOrVisitAt: payload.reservationOrVisitAt ?? "",
    callDateTime: payload.callDateTime || toKstNowYmdHm(),
  };

  const res = await client.get("", { params });
  if (!res.data?.ok) throw new Error(res.data?.error || "save failed");
  return params;
});

const leadsSlice = createSlice({
  name: "leads",
  initialState: { items: [], loading: false, error: "", lastFetchedAt: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (s) => { s.loading = true; s.error = ""; })
      .addCase(fetchLeads.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; s.lastFetchedAt = Date.now(); })
      .addCase(fetchLeads.rejected, (s, a) => { s.loading = false; s.error = a.error?.message || "fetch failed"; })
      .addCase(saveLead.fulfilled, (s, a) => {
        const p = a.payload;
        const idx = s.items.findIndex((x) => x.leadId === p.leadId && x.eventType === p.eventType);
        if (idx !== -1) {
          s.items[idx] = {
            ...s.items[idx],
            status: p.status,
            memo: p.memo,
            reservationOrVisitAt: p.reservationOrVisitAt,
            callDateTime: p.callDateTime,
            updatedAt: new Date().toISOString(),
          };
        }
      })
      .addCase(saveLead.rejected, (s, a) => { s.error = a.error?.message || "save failed"; });
  },
});

export default leadsSlice.reducer;
