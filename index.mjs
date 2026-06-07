export default {
  async fetch(request, env, ctx) {
    return new Response(HTML, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0f172a">
<title>Claim Tracker</title>
<style>
  :root{
    --bg:#0f172a;--card:#1e293b;--card2:#334155;--accent:#38bdf8;--accent2:#22c55e;
    --text:#f1f5f9;--muted:#94a3b8;--danger:#ef4444;--border:#334155;--radius:14px;
    --travel:#38bdf8;--expense:#22c55e;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    background:var(--bg);color:var(--text);padding-bottom:90px;
    padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right);}
  header{position:sticky;top:0;z-index:20;background:rgba(15,23,42,.92);backdrop-filter:blur(10px);
    padding:16px 18px calc(12px);padding-top:calc(16px + env(safe-area-inset-top));
    border-bottom:1px solid var(--border);}
  header h1{margin:0;font-size:20px;display:flex;align-items:center;gap:8px}
  .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:10px;
    border-left:3px solid var(--border)}
  .stat.trv{border-left-color:var(--travel)}
  .stat.exp{border-left-color:var(--expense)}
  .stat.tot{border-left-color:#a78bfa}
  .stat .lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
  .stat .val{font-size:17px;font-weight:700;margin-top:3px}
  .stat.trv .val{color:var(--travel)}
  .stat.exp .val{color:var(--expense)}
  .stat.tot .val{color:#a78bfa}
  main{padding:16px 16px 0}
  .card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);
    padding:14px;margin-bottom:12px}
  .card.list{padding:0;overflow:hidden}
  .mhead{display:flex;justify-content:space-between;align-items:baseline;padding:0 4px;
    margin:16px 0 6px;font-size:12px;color:var(--muted);font-weight:700;
    text-transform:uppercase;letter-spacing:.05em}
  .mhead .sub{font-size:13px}
  .mhead.trv .sub{color:var(--travel)}
  .mhead.exp .sub{color:var(--expense)}
  .erow{display:flex;justify-content:space-between;align-items:center;gap:10px;
    padding:11px 13px;border-bottom:1px solid var(--border);cursor:pointer;
    border-left:3px solid transparent}
  .erow:last-child{border-bottom:none}
  .erow:active{background:var(--card2)}
  .erow.trv{border-left-color:var(--travel)}
  .erow.exp{border-left-color:var(--expense)}
  .erow .l{min-width:0;flex:1}
  .erow .t{font-size:14.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .erow .s{font-size:11.5px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    display:flex;align-items:center;gap:5px}
  .cdot{display:inline-block;width:8px;height:8px;border-radius:50%;flex:none}
  .erow .r{display:flex;align-items:center;gap:7px;white-space:nowrap}
  .erow .amt{font-weight:700;font-size:14.5px}
  .erow.trv .amt{color:var(--travel)}
  .erow.exp .amt{color:var(--expense)}
  .erow .clip{font-size:12px;color:var(--muted)}
  .erow .chev{color:var(--muted);font-size:16px}
  .empty{text-align:center;color:var(--muted);padding:50px 20px;font-size:14px}
  .empty .big{font-size:40px;margin-bottom:8px}
  .empty .sb{margin-top:14px}
  .filterbar{display:flex;gap:8px;margin-bottom:12px}
  .filterbar input{flex:1}
  .listhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .listhead .cnt{font-size:12.5px;color:var(--muted)}
  .listhead .clr{background:none;border:none;color:var(--danger);font-size:13px;cursor:pointer;font-weight:600}
  label{display:block;font-size:12.5px;color:var(--muted);margin:10px 0 4px;font-weight:500}
  input,select,textarea{width:100%;padding:12px;background:var(--card2);border:1px solid var(--border);
    color:var(--text);border-radius:10px;font-size:16px;font-family:inherit}
  textarea{resize:vertical;min-height:60px}
  .row{display:flex;gap:10px}.row>*{flex:1}
  button{cursor:pointer;font-family:inherit}
  .btn{width:100%;padding:14px;border:none;border-radius:10px;font-size:16px;font-weight:600;
    background:var(--accent);color:#04243a;margin-top:16px}
  .btn.green{background:var(--expense);color:#053018}
  .btn.blue{background:var(--travel);color:#04243a}
  .btn.ghost{background:var(--card2);color:var(--text);border:1px solid var(--border)}
  .btn.red{background:var(--danger);color:#fff}
  .btn.sm{padding:11px;font-size:14px;margin-top:0}
  .photoadd{display:flex;gap:8px;margin-top:6px}
  .photoadd .pbtn{flex:1;padding:12px;text-align:center;background:var(--card2);
    border:1px dashed var(--border);border-radius:10px;font-size:13px;color:var(--muted)}
  .prevs{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .prevs .pw{position:relative}
  .prevs img{width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
  .prevs .x{position:absolute;top:-6px;right:-6px;background:var(--danger);color:#fff;border:none;
    width:22px;height:22px;border-radius:50%;font-size:13px;line-height:1}
  nav{position:fixed;bottom:0;left:0;right:0;z-index:30;display:flex;background:rgba(30,41,59,.96);
    backdrop-filter:blur(10px);border-top:1px solid var(--border);
    padding-bottom:env(safe-area-inset-bottom)}
  nav button{flex:1;background:none;border:none;color:var(--muted);padding:10px 0 12px;
    font-size:11px;display:flex;flex-direction:column;align-items:center;gap:3px}
  nav button[data-tab="travel"].active{color:var(--travel)}
  nav button[data-tab="expenses"].active{color:var(--expense)}
  nav button[data-tab="reports"].active{color:#a78bfa}
  nav button .ic{font-size:21px}
  .sheet{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.6);display:none;align-items:flex-end}
  .sheet.open{display:flex}
  .sheet .panel{background:var(--bg);width:100%;max-height:92vh;overflow-y:auto;border-radius:20px 20px 0 0;
    padding:8px 18px calc(28px + env(safe-area-inset-bottom));border-top:1px solid var(--border)}
  .grab{width:42px;height:5px;background:var(--card2);border-radius:3px;margin:8px auto 6px}
  .sheet h2{margin:6px 0 0;font-size:18px}
  .detamt{font-size:26px;font-weight:800;margin:8px 0 14px}
  .detamt.trv{color:var(--travel)}
  .detamt.exp{color:var(--expense)}
  .detrow{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px}
  .detrow .k{color:var(--muted);min-width:96px;font-size:12.5px;padding-top:1px}
  .detrow .v{flex:1;line-height:1.5}
  .catpill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:20px;
    font-size:13px;font-weight:600}
  .detphotos{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0}
  .detphotos img{width:84px;height:84px;object-fit:cover;border-radius:10px;border:1px solid var(--border);cursor:pointer}
  .imgview{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.92);display:none;
    align-items:center;justify-content:center;padding:20px}
  .imgview.open{display:flex}
  .imgview img{max-width:100%;max-height:90vh;border-radius:10px}
  .calc{font-size:12px;color:var(--muted);margin-top:6px}
  .toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--accent2);
    color:#053018;padding:10px 18px;border-radius:30px;font-weight:600;font-size:14px;z-index:60;
    opacity:0;transition:.3s;pointer-events:none}
  .toast.show{opacity:1}
  .seg{display:flex;background:var(--card2);border-radius:10px;padding:3px;margin-bottom:4px}
  .seg button{flex:1;padding:9px;border:none;background:none;color:var(--muted);border-radius:8px;font-weight:600;font-size:14px}
  .seg button#segTravel.on{background:var(--travel);color:#04243a}
  .seg button#segExp.on{background:var(--expense);color:#053018}
  .subseg{display:flex;background:var(--card2);border-radius:9px;padding:3px;margin:10px 0 2px}
  .subseg button{flex:1;padding:8px;border:none;background:none;color:var(--muted);border-radius:7px;font-weight:600;font-size:13px}
  .subseg button.on{background:var(--bg);color:var(--travel)}
  .settingsrow{display:flex;justify-content:space-between;align-items:center;gap:12px}
  .settingsrow input{max-width:120px}
  a.exp{display:block;text-align:center;padding:13px;background:var(--card2);border:1px solid var(--border);
    border-radius:10px;color:var(--text);text-decoration:none;font-weight:600;margin-bottom:10px}
  .cardhd{font-weight:600;margin-bottom:10px}
  .quick{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 2px}
  .quick button{flex:1;min-width:60px;padding:9px 4px;background:var(--card2);border:1px solid var(--border);
    color:var(--text);border-radius:9px;font-size:12.5px;font-weight:600}
  .quick button.on{background:var(--accent);color:#04243a;border-color:var(--accent)}
</style>
</head>
<body>
<header>
  <h1>🧾 Claim Tracker</h1>
  <div class="summary">
    <div class="stat trv"><div class="lbl">Travel</div><div class="val" id="sTrv">£0</div></div>
    <div class="stat exp"><div class="lbl">Expenses</div><div class="val" id="sExp">£0</div></div>
    <div class="stat tot"><div class="lbl">Total Claim</div><div class="val" id="sTot">£0</div></div>
  </div>
</header>

<main>
  <!-- TRAVEL TAB -->
  <section id="tab-travel">
    <div class="filterbar"><input id="trvSearch" placeholder="🔍 Search travel..." oninput="render()"></div>
    <div class="listhead"><div class="cnt" id="trvCnt"></div><button class="clr" onclick="deleteAll('travel')">🗑 Delete all</button></div>
    <div id="trvList"></div>
  </section>

  <!-- EXPENSES TAB -->
  <section id="tab-expenses" style="display:none">
    <div class="filterbar"><input id="expSearch" placeholder="🔍 Search expenses..." oninput="render()"></div>
    <div class="listhead"><div class="cnt" id="expCnt"></div><button class="clr" onclick="deleteAll('exp')">🗑 Delete all</button></div>
    <div id="expList"></div>
  </section>

  <!-- REPORTS TAB -->
  <section id="tab-reports" style="display:none">
    <div class="card">
      <div class="cardhd">📅 Date range</div>
      <div class="quick" id="quickRange">
        <button data-r="all" class="on" onclick="setQuick('all')">All</button>
        <button data-r="month" onclick="setQuick('month')">This month</button>
        <button data-r="last" onclick="setQuick('last')">Last month</button>
        <button data-r="ytd" onclick="setQuick('ytd')">YTD</button>
      </div>
      <div class="row">
        <div><label>From</label><input type="date" id="fromDate" onchange="customRange()"></div>
        <div><label>To</label><input type="date" id="toDate" onchange="customRange()"></div>
      </div>
    </div>
    <div class="card">
      <div class="cardhd">📊 Summary <span id="rangeLbl" style="color:var(--muted);font-weight:400;font-size:12px"></span></div>
      <div id="reportBody"></div>
    </div>
    <div class="card">
      <div class="cardhd">⬇️ Export for claims <span style="color:var(--muted);font-weight:400;font-size:12px">(selected range)</span></div>
      <a class="exp" id="trvCsvLink">Export Travel (CSV)</a>
      <a class="exp" id="expCsvLink">Export Expenses (CSV)</a>
      <a class="exp" id="backupLink">Backup ALL data (JSON)</a>
      <label>Restore from backup</label>
      <input type="file" id="restoreFile" accept="application/json" onchange="restore(event)">
    </div>
    <div class="card">
      <div class="settingsrow">
        <div><div style="font-weight:600">Mileage rate</div><div class="calc">£ per mile used for claims</div></div>
        <input type="number" step="0.01" id="rateInput" onchange="saveRate()">
      </div>
    </div>
    <div class="card">
      <div class="cardhd">🧪 Sample data</div>
      <div class="row">
        <button class="btn ghost sm" style="flex:1" onclick="loadSamples()">Load May samples</button>
        <button class="btn red sm" style="flex:1;margin-top:0" onclick="wipeEverything()">Delete everything</button>
      </div>
    </div>
  </section>
</main>

<nav>
  <button data-tab="travel" class="active" onclick="switchTab('travel')"><span class="ic">🚗</span>Travel</button>
  <button data-tab="expenses" onclick="switchTab('expenses')"><span class="ic">💳</span>Expenses</button>
  <button data-tab="reports" onclick="switchTab('reports')"><span class="ic">📊</span>Reports</button>
</nav>

<button class="fab" style="position:fixed;bottom:calc(74px + env(safe-area-inset-bottom));right:18px;z-index:35;
  width:58px;height:58px;border-radius:50%;border:none;background:var(--accent);color:#04243a;
  font-size:30px;box-shadow:0 6px 18px rgba(0,0,0,.4)" onclick="openSheet()">+</button>

<!-- ADD SHEET -->
<div class="sheet" id="sheet">
  <div class="panel">
    <div class="grab"></div>
    <div class="seg">
      <button id="segTravel" class="on" onclick="setForm('travel')">🚗 Travel</button>
      <button id="segExp" onclick="setForm('exp')">💳 Expense</button>
    </div>

    <!-- TRAVEL FORM -->
    <form id="formTravel" onsubmit="return saveTravel(event)">
      <div class="row">
        <div><label>Date</label><input type="date" id="t_date" required></div>
        <div><label>Time</label><input type="time" id="t_time" required></div>
      </div>
      <div class="subseg">
        <button type="button" id="subMil" class="on" onclick="setTravelKind('mileage')">🚗 Mileage</button>
        <button type="button" id="subCost" onclick="setTravelKind('cost')">🚆 Train / bus / etc.</button>
      </div>

      <!-- mileage fields -->
      <div id="travelMileage">
        <label>Start location</label><input id="t_from" placeholder="e.g. Office, London">
        <div class="row">
          <div><label>Start postcode</label><input id="t_fromp" placeholder="SW1A 1AA"></div>
          <div><label>End postcode</label><input id="t_top" placeholder="M1 1AE"></div>
        </div>
        <label>End location</label><input id="t_to" placeholder="e.g. Client site, Manchester">
        <label>Miles travelled</label><input type="number" step="0.1" id="t_miles" placeholder="0.0" oninput="updateMileCalc()">
        <div class="calc" id="t_calc">Reimbursement: £0.00</div>
      </div>

      <!-- travel cost fields -->
      <div id="travelCost" style="display:none">
        <label>Type</label>
        <select id="t_ttype">
          <option>Train</option><option>Bus / Coach</option><option>Flight</option>
          <option>Taxi</option><option>Parking</option><option>Fuel</option>
          <option>Tube / Tram</option><option>Toll / Congestion</option><option>Other travel</option>
        </select>
        <label>Item / Description</label><input id="t_item" placeholder="e.g. Off-peak return to Leeds">
        <label>Cost (£)</label><input type="number" step="0.01" id="t_cost" placeholder="0.00">
      </div>

      <label>Reason for travel</label><textarea id="t_reason" placeholder="Business purpose..."></textarea>
      <label>Receipt / ticket photos</label>
      <div class="photoadd">
        <label class="pbtn">📷 Camera<input type="file" accept="image/*" capture="environment" hidden onchange="addPhoto(event,'travel')"></label>
        <label class="pbtn">🖼️ Gallery<input type="file" accept="image/*" multiple hidden onchange="addPhoto(event,'travel')"></label>
      </div>
      <div class="prevs" id="t_prevs"></div>
      <button type="submit" class="btn blue">Save Travel</button>
      <button type="button" class="btn ghost" onclick="closeSheet()">Cancel</button>
    </form>

    <!-- EXPENSE FORM -->
    <form id="formExp" style="display:none" onsubmit="return saveExpense(event)">
      <div class="row">
        <div><label>Date</label><input type="date" id="e_date" required></div>
        <div><label>Time</label><input type="time" id="e_time" required></div>
      </div>
      <label>Item / Description</label><input id="e_item" placeholder="e.g. Working lunch" required>
      <label>Cost (£)</label><input type="number" step="0.01" id="e_cost" placeholder="0.00" required>
      <label>Reason for expense</label><textarea id="e_reason" placeholder="Business purpose..."></textarea>
      <label>Receipt photos</label>
      <div class="photoadd">
        <label class="pbtn">📷 Camera<input type="file" accept="image/*" capture="environment" hidden onchange="addPhoto(event,'exp')"></label>
        <label class="pbtn">🖼️ Gallery<input type="file" accept="image/*" multiple hidden onchange="addPhoto(event,'exp')"></label>
      </div>
      <div class="prevs" id="e_prevs"></div>
      <button type="submit" class="btn green">Save Expense</button>
      <button type="button" class="btn ghost" onclick="closeSheet()">Cancel</button>
    </form>
  </div>
</div>

<!-- DETAIL SHEET -->
<div class="sheet" id="detailSheet">
  <div class="panel">
    <div class="grab"></div>
    <div id="detailBody"></div>
  </div>
</div>

<div class="imgview" id="imgview" onclick="this.classList.remove('open')"><img id="imgviewImg"></div>
<div class="toast" id="toast"></div>

<script>
const LS={exp:'ct_expenses',trv:'ct_travel',mil:'ct_mileage',rate:'ct_rate',seeded:'ct_seeded',mig:'ct_migrated'};
let expenses=load(LS.exp), travel=load(LS.trv);
let rate=parseFloat(localStorage.getItem(LS.rate))||0.45;
let pendingPhotos={travel:[],exp:[]};
let curTab='travel';
let travelKind='mileage';
let range={from:'',to:''};

function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}}
function save(){localStorage.setItem(LS.exp,JSON.stringify(expenses));localStorage.setItem(LS.trv,JSON.stringify(travel));}
function money(n){return '£'+(Number(n)||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function esc(s){return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}

// amount of any travel entry
function trvAmount(x){return x.kind==='mileage'?(x.miles*rate):(x.cost||0);}

// ---- One-time migration from old (mileage tab + categorised expenses) model ----
function migrate(){
  if(localStorage.getItem(LS.mig)==='2')return;
  let changed=false;
  // old mileage array -> travel mileage entries
  const oldMil=load(LS.mil);
  if(oldMil.length){
    oldMil.forEach(m=>travel.push({id:m.id||uid(),kind:'mileage',date:m.date,time:m.time,
      from:m.from,fromp:m.fromp,to:m.to,top:m.top,miles:m.miles,reason:m.reason,photos:m.photos||[]}));
    changed=true;
  }
  // old categorised expenses -> split into travel costs vs expenses
  const TRAVELCAT={Travel:'Other travel',Fuel:'Fuel',Parking:'Parking'};
  if(expenses.some(x=>x.cat)){
    const keep=[];
    expenses.forEach(x=>{
      if(x.cat&&TRAVELCAT[x.cat]){
        travel.push({id:x.id||uid(),kind:'cost',date:x.date,time:x.time,item:x.item,
          ttype:TRAVELCAT[x.cat],cost:x.cost,reason:x.reason,photos:x.photos||[]});
      }else{
        keep.push({id:x.id||uid(),date:x.date,time:x.time,item:x.item,cost:x.cost,
          reason:x.reason,photos:x.photos||[]});
      }
    });
    expenses=keep;changed=true;
  }
  if(changed)save();
  localStorage.setItem(LS.mig,'2');
}

// ---- Sample receipts ----
function receipt(label,sub,color){
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="220" height="280">'+
    '<rect width="220" height="280" fill="'+color+'"/>'+
    '<rect x="22" y="20" width="176" height="240" rx="10" fill="#ffffff"/>'+
    '<text x="110" y="70" font-family="monospace" font-size="20" font-weight="bold" fill="#1e293b" text-anchor="middle">'+label+'</text>'+
    '<text x="110" y="100" font-family="monospace" font-size="13" fill="#64748b" text-anchor="middle">'+sub+'</text>'+
    '<line x1="42" y1="125" x2="178" y2="125" stroke="#cbd5e1" stroke-dasharray="4 4"/>'+
    '<text x="50" y="155" font-family="monospace" font-size="12" fill="#94a3b8">Item .......... 1</text>'+
    '<text x="50" y="180" font-family="monospace" font-size="12" fill="#94a3b8">VAT ........ 20%</text>'+
    '<line x1="42" y1="200" x2="178" y2="200" stroke="#cbd5e1" stroke-dasharray="4 4"/>'+
    '<text x="110" y="230" font-family="monospace" font-size="15" font-weight="bold" fill="#1e293b" text-anchor="middle">THANK YOU</text>'+
    '</svg>';
  return 'data:image/svg+xml;base64,'+btoa(svg);
}

// ---- Full month of May sample data ----
function may(day){const y=new Date().getFullYear();return y+'-05-'+String(day).padStart(2,'0');}
function sampleData(){
  const trv=[
    {kind:'mileage',date:may(1),time:'07:30',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Acme Ltd, Birmingham',top:'B1 1AA',miles:118.0,reason:'Kick-off client meeting',photos:[receipt('PARK','£8.00','#f59e0b')]},
    {kind:'cost',date:may(1),time:'08:42',ttype:'Train',item:'Off-peak return to Birmingham',cost:48.60,reason:'Kick-off client meeting',photos:[receipt('RAIL','£48.60','#0ea5e9')]},
    {kind:'cost',date:may(2),time:'09:10',ttype:'Parking',item:'NCP all-day parking',cost:14.00,reason:'Parking at Birmingham office',photos:[receipt('PARK','£14.00','#f59e0b')]},
    {kind:'mileage',date:may(5),time:'08:00',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Site visit, Manchester',top:'M1 1AE',miles:44.5,reason:'Project site inspection',photos:[]},
    {kind:'cost',date:may(6),time:'07:45',ttype:'Fuel',item:'Fuel — diesel',cost:69.40,reason:'Refuel for site tour',photos:[receipt('FUEL','£69.40','#ef4444')]},
    {kind:'mileage',date:may(7),time:'08:15',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Client HQ, Sheffield',top:'S1 2HE',miles:36.2,reason:'Quarterly review',photos:[]},
    {kind:'cost',date:may(8),time:'12:20',ttype:'Tube / Tram',item:'Tram day ticket — Sheffield',cost:4.80,reason:'Travel between client sites',photos:[]},
    {kind:'cost',date:may(9),time:'06:30',ttype:'Flight',item:'Return flight LBA–EDI',cost:132.00,reason:'Edinburgh conference travel',photos:[receipt('FLIGHT','£132','#0ea5e9')]},
    {kind:'cost',date:may(9),time:'18:40',ttype:'Taxi',item:'Taxi airport to hotel',cost:22.50,reason:'Conference travel',photos:[]},
    {kind:'mileage',date:may(12),time:'07:50',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Supplier, Bradford',top:'BD1 1PG',miles:18.4,reason:'Supplier negotiation',photos:[]},
    {kind:'cost',date:may(13),time:'09:05',ttype:'Train',item:'Return to Leeds city',cost:6.20,reason:'Internal meeting',photos:[]},
    {kind:'mileage',date:may(14),time:'08:10',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Client site, York',top:'YO1 7HH',miles:52.0,reason:'Implementation workshop',photos:[receipt('PARK','£9.50','#f59e0b')]},
    {kind:'cost',date:may(15),time:'08:30',ttype:'Bus / Coach',item:'Coach to Newcastle',cost:19.90,reason:'Regional team day',photos:[receipt('COACH','£19.90','#0ea5e9')]},
    {kind:'cost',date:may(16),time:'10:15',ttype:'Toll / Congestion',item:'Tyne Tunnel toll',cost:2.60,reason:'Travel to depot',photos:[]},
    {kind:'mileage',date:may(19),time:'07:40',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Client HQ, Nottingham',top:'NG1 5DT',miles:88.0,reason:'Contract signing',photos:[]},
    {kind:'cost',date:may(20),time:'08:55',ttype:'Parking',item:'Multi-storey parking',cost:11.00,reason:'All-day parking Nottingham',photos:[receipt('PARK','£11.00','#f59e0b')]},
    {kind:'mileage',date:may(21),time:'08:05',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Site visit, Wakefield',top:'WF1 1XX',miles:21.6,reason:'Snagging visit',photos:[]},
    {kind:'cost',date:may(22),time:'09:20',ttype:'Train',item:'Off-peak return to London',cost:96.40,reason:'Head office review',photos:[receipt('RAIL','£96.40','#0ea5e9')]},
    {kind:'cost',date:may(22),time:'18:10',ttype:'Tube / Tram',item:'Oyster — London travel',cost:8.40,reason:'Head office review',photos:[]},
    {kind:'mileage',date:may(26),time:'08:00',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Client site, Hull',top:'HU1 1UU',miles:61.0,reason:'Annual audit support',photos:[]},
    {kind:'cost',date:may(27),time:'07:30',ttype:'Fuel',item:'Fuel — diesel',cost:72.10,reason:'Refuel after audit week',photos:[receipt('FUEL','£72.10','#ef4444')]},
    {kind:'cost',date:may(28),time:'17:45',ttype:'Taxi',item:'Taxi to station',cost:16.80,reason:'Late meeting overrun',photos:[]},
    {kind:'mileage',date:may(29),time:'08:20',from:'Home Office, Leeds',fromp:'LS1 4AP',to:'Client HQ, Sheffield',top:'S1 2HE',miles:36.2,reason:'Month-end wrap-up',photos:[]},
    {kind:'cost',date:may(30),time:'09:00',ttype:'Toll / Congestion',item:'M6 Toll',cost:7.40,reason:'Travel to Midlands client',photos:[]},
  ];
  const ex=[
    {date:may(1),time:'12:30',item:'Lunch with client',cost:34.20,reason:'Working lunch — Acme Ltd',photos:[receipt('CAFE','£34.20','#22c55e')]},
    {date:may(2),time:'19:15',item:'Hotel — 1 night',cost:96.00,reason:'Overnight stay Birmingham',photos:[receipt('HOTEL','£96.00','#8b5cf6')]},
    {date:may(5),time:'13:10',item:'Site lunch',cost:11.75,reason:'Lunch during site visit',photos:[]},
    {date:may(6),time:'16:40',item:'Printer paper & ink',cost:27.99,reason:'Home office supplies',photos:[]},
    {date:may(9),time:'20:30',item:'Hotel — Edinburgh',cost:118.00,reason:'Conference overnight',photos:[receipt('HOTEL','£118','#8b5cf6')]},
    {date:may(10),time:'08:20',item:'Conference breakfast',cost:12.40,reason:'Conference catering',photos:[]},
    {date:may(11),time:'10:15',item:'Conference ticket',cost:149.00,reason:'Industry conference — networking',photos:[receipt('TICKET','£149','#22c55e')]},
    {date:may(13),time:'13:00',item:'Team lunch',cost:42.00,reason:'Internal team catch-up',photos:[receipt('CAFE','£42.00','#22c55e')]},
    {date:may(14),time:'19:30',item:'Hotel — York',cost:104.00,reason:'Overnight for workshop',photos:[receipt('HOTEL','£104','#8b5cf6')]},
    {date:may(16),time:'13:25',item:'Coffee meeting',cost:8.75,reason:'Catch-up with supplier',photos:[]},
    {date:may(19),time:'12:50',item:'Client dinner',cost:78.40,reason:'Contract signing celebration',photos:[receipt('DINER','£78.40','#22c55e')]},
    {date:may(20),time:'15:10',item:'Stationery & folders',cost:15.99,reason:'Office supplies',photos:[]},
    {date:may(22),time:'13:30',item:'Lunch — London',cost:24.60,reason:'Head office review lunch',photos:[]},
    {date:may(26),time:'19:45',item:'Hotel — Hull',cost:88.00,reason:'Overnight for audit',photos:[receipt('HOTEL','£88.00','#8b5cf6')]},
    {date:may(28),time:'12:15',item:'Working lunch',cost:18.50,reason:'Lunch with audit team',photos:[]},
    {date:may(30),time:'09:30',item:'Software subscription',cost:29.00,reason:'Monthly project tool licence',photos:[]},
  ];
  return {trv:trv.map(x=>({id:uid(),...x})),ex:ex.map(x=>({id:uid(),...x}))};
}
function loadSamples(){
  const s=sampleData();
  travel=travel.concat(s.trv);expenses=expenses.concat(s.ex);
  save();render();toast('May sample data added ✓');switchTab('travel');
}
function wipeEverything(){
  if(!confirm('Delete ALL travel and expenses? This cannot be undone.'))return;
  expenses=[];travel=[];save();render();toast('All data deleted');
}
function deleteAll(type){
  const list=type==='exp'?expenses:travel;
  if(!list.length){toast('Nothing to delete');return;}
  if(!confirm('Delete all '+list.length+(type==='exp'?' expenses?':' travel entries?')))return;
  if(type==='exp')expenses=[];else travel=[];
  save();render();toast('Deleted ✓');
}

function switchTab(t){
  curTab=t;
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  ['travel','expenses','reports'].forEach(x=>document.getElementById('tab-'+x).style.display=x===t?'':'none');
  render();
}

// ---- Photo handling with compression ----
function addPhoto(e,type){
  const files=[...e.target.files];
  files.forEach(f=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const max=1000;let w=img.width,h=img.height;
        if(w>max||h>max){const r=Math.min(max/w,max/h);w*=r;h*=r;}
        const c=document.createElement('canvas');c.width=w;c.height=h;
        c.getContext('2d').drawImage(img,0,0,w,h);
        pendingPhotos[type].push(c.toDataURL('image/jpeg',0.6));
        renderPrevs(type);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(f);
  });
  e.target.value='';
}
function renderPrevs(type){
  const el=document.getElementById(type==='exp'?'e_prevs':'t_prevs');
  el.innerHTML=pendingPhotos[type].map((p,i)=>
    '<div class="pw"><img src="'+p+'"><button type="button" class="x" onclick="rmPhoto(\\''+type+'\\','+i+')">×</button></div>').join('');
}
function rmPhoto(type,i){pendingPhotos[type].splice(i,1);renderPrevs(type);}

// ---- Add sheet ----
function openSheet(){
  setForm(curTab==='expenses'?'exp':'travel');
  const now=new Date();const d=now.toISOString().slice(0,10);const t=now.toTimeString().slice(0,5);
  t_date.value=d;t_time.value=t;e_date.value=d;e_time.value=t;
  document.getElementById('sheet').classList.add('open');
}
function closeSheet(){document.getElementById('sheet').classList.remove('open');}
document.getElementById('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
function setForm(which){
  document.getElementById('segTravel').classList.toggle('on',which==='travel');
  document.getElementById('segExp').classList.toggle('on',which==='exp');
  document.getElementById('formTravel').style.display=which==='travel'?'':'none';
  document.getElementById('formExp').style.display=which==='exp'?'':'none';
}
function setTravelKind(k){
  travelKind=k;
  document.getElementById('subMil').classList.toggle('on',k==='mileage');
  document.getElementById('subCost').classList.toggle('on',k==='cost');
  document.getElementById('travelMileage').style.display=k==='mileage'?'':'none';
  document.getElementById('travelCost').style.display=k==='cost'?'':'none';
}
function updateMileCalc(){t_calc.textContent='Reimbursement: '+money((parseFloat(t_miles.value)||0)*rate)+' (@ '+money(rate)+'/mi)';}

// ---- Save ----
function saveTravel(ev){
  ev.preventDefault();
  const base={id:uid(),date:t_date.value,time:t_time.value,reason:t_reason.value.trim(),photos:pendingPhotos.travel.slice()};
  if(travelKind==='mileage'){
    if(!t_from.value.trim()||!t_to.value.trim()||!(parseFloat(t_miles.value)>0)){toast('Add start, end & miles');return false;}
    travel.push({...base,kind:'mileage',from:t_from.value.trim(),fromp:t_fromp.value.trim().toUpperCase(),
      to:t_to.value.trim(),top:t_top.value.trim().toUpperCase(),miles:parseFloat(t_miles.value)||0});
  }else{
    if(!t_item.value.trim()||!(parseFloat(t_cost.value)>=0&&t_cost.value!=='')){toast('Add item & cost');return false;}
    travel.push({...base,kind:'cost',item:t_item.value.trim(),ttype:t_ttype.value,cost:parseFloat(t_cost.value)||0});
  }
  save();pendingPhotos.travel=[];document.getElementById('formTravel').reset();renderPrevs('travel');
  setTravelKind('mileage');updateMileCalc();
  closeSheet();toast('Travel saved ✓');switchTab('travel');return false;
}
function saveExpense(ev){
  ev.preventDefault();
  expenses.push({id:uid(),date:e_date.value,time:e_time.value,item:e_item.value.trim(),
    cost:parseFloat(e_cost.value)||0,reason:e_reason.value.trim(),photos:pendingPhotos.exp.slice()});
  save();pendingPhotos.exp=[];document.getElementById('formExp').reset();renderPrevs('exp');
  closeSheet();toast('Expense saved ✓');switchTab('expenses');return false;
}

// ---- Detail sheet ----
function openDetail(type,id){
  const x=(type==='exp'?expenses:travel).find(e=>e.id===id);
  if(!x)return;
  let h='';
  if(type==='exp'){
    h='<h2>'+esc(x.item)+'</h2>'+
      '<div class="detamt exp">'+money(x.cost)+'</div>'+
      detRow('Date',fmtDate(x.date,x.time))+
      detRow('Category','<span class="catpill" style="background:var(--expense)22;color:var(--expense)"><span class="cdot" style="background:var(--expense)"></span>Expense</span>')+
      (x.reason?detRow('Reason',esc(x.reason)):'');
  }else if(x.kind==='mileage'){
    h='<h2>'+esc(x.from)+' → '+esc(x.to)+'</h2>'+
      '<div class="detamt trv">'+money(x.miles*rate)+' <span style="font-size:14px;color:var(--muted);font-weight:600">· '+x.miles+' mi @ '+money(rate)+'/mi</span></div>'+
      detRow('Type','<span class="catpill" style="background:var(--travel)22;color:var(--travel)"><span class="cdot" style="background:var(--travel)"></span>Travel · Mileage</span>')+
      detRow('Date',fmtDate(x.date,x.time))+
      detRow('From',esc(x.from)+(x.fromp?' ('+esc(x.fromp)+')':''))+
      detRow('To',esc(x.to)+(x.top?' ('+esc(x.top)+')':''))+
      detRow('Miles',x.miles+' mi')+
      (x.reason?detRow('Reason',esc(x.reason)):'');
  }else{
    h='<h2>'+esc(x.item)+'</h2>'+
      '<div class="detamt trv">'+money(x.cost)+'</div>'+
      detRow('Type','<span class="catpill" style="background:var(--travel)22;color:var(--travel)"><span class="cdot" style="background:var(--travel)"></span>Travel · '+esc(x.ttype)+'</span>')+
      detRow('Date',fmtDate(x.date,x.time))+
      (x.reason?detRow('Reason',esc(x.reason)):'');
  }
  if(x.photos&&x.photos.length){
    h+='<div class="detphotos">'+x.photos.map(p=>'<img src="'+p+'" onclick="viewImg(\\''+p+'\\')">').join('')+'</div>';
  }
  h+='<button class="btn red" onclick="delEntry(\\''+type+'\\',\\''+id+'\\')">🗑 Delete entry</button>'+
     '<button class="btn ghost" onclick="closeDetail()">Close</button>';
  document.getElementById('detailBody').innerHTML=h;
  document.getElementById('detailSheet').classList.add('open');
}
function detRow(k,v){return '<div class="detrow"><div class="k">'+k+'</div><div class="v">'+v+'</div></div>'}
function closeDetail(){document.getElementById('detailSheet').classList.remove('open');}
document.getElementById('detailSheet').addEventListener('click',e=>{if(e.target.id==='detailSheet')closeDetail()});

function delEntry(type,id){
  if(!confirm('Delete this entry?'))return;
  if(type==='exp')expenses=expenses.filter(x=>x.id!==id);else travel=travel.filter(x=>x.id!==id);
  save();closeDetail();render();toast('Deleted ✓');
}
function viewImg(src){document.getElementById('imgviewImg').src=src;document.getElementById('imgview').classList.add('open');}

function fmtDate(d,t){
  if(!d)return '';
  const dt=new Date(d+'T'+(t||'00:00'));
  return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+(t?' · '+t:'');
}
function shortDate(d,t){
  if(!d)return '';
  const dt=new Date(d+'T'+(t||'00:00'));
  return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+(t?' · '+t:'');
}
function monthLabel(key){
  const [y,m]=key.split('-');
  return new Date(+y,+m-1,1).toLocaleDateString('en-GB',{month:'long',year:'numeric'});
}
function groupByMonth(list){
  const g={};
  list.forEach(x=>{const k=(x.date||'').slice(0,7);(g[k]=g[k]||[]).push(x);});
  return Object.keys(g).sort().reverse().map(k=>({key:k,items:g[k]}));
}

// ---- Date range ----
function setQuick(r){
  document.querySelectorAll('#quickRange button').forEach(b=>b.classList.toggle('on',b.dataset.r===r));
  const now=new Date();const y=now.getFullYear(),m=now.getMonth();
  const iso=d=>d.toISOString().slice(0,10);
  if(r==='all'){range={from:'',to:''};}
  else if(r==='month'){range={from:iso(new Date(y,m,1)),to:iso(new Date(y,m+1,0))};}
  else if(r==='last'){range={from:iso(new Date(y,m-1,1)),to:iso(new Date(y,m,0))};}
  else if(r==='ytd'){range={from:iso(new Date(y,0,1)),to:iso(now)};}
  fromDate.value=range.from;toDate.value=range.to;
  render();
}
function customRange(){
  range={from:fromDate.value,to:toDate.value};
  document.querySelectorAll('#quickRange button').forEach(b=>b.classList.remove('on'));
  render();
}
function inRange(d){
  if(range.from&&d<range.from)return false;
  if(range.to&&d>range.to)return false;
  return true;
}

// ---- Render ----
function render(){
  const fTrv=travel.filter(x=>inRange(x.date));
  const fExp=expenses.filter(x=>inRange(x.date));

  const trvTotal=fTrv.reduce((a,b)=>a+trvAmount(b),0);
  const expTotal=fExp.reduce((a,b)=>a+b.cost,0);
  sTrv.textContent=money(trvTotal);sExp.textContent=money(expTotal);sTot.textContent=money(trvTotal+expTotal);

  // travel list grouped by month
  const tq=(trvSearch.value||'').toLowerCase();
  const tl=travel.filter(x=>{
    const hay=x.kind==='mileage'?(x.from+' '+x.to+' '+x.fromp+' '+x.top+' '+x.reason):(x.item+' '+x.ttype+' '+x.reason);
    return !tq||hay.toLowerCase().includes(tq);
  }).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  trvCnt.textContent=tl.length+' entr'+(tl.length===1?'y':'ies');
  trvList.innerHTML=tl.length?groupByMonth(tl).map(g=>{
    const sub=g.items.reduce((a,b)=>a+trvAmount(b),0);
    return '<div class="mhead trv"><span>'+monthLabel(g.key)+'</span><span class="sub">'+money(sub)+'</span></div>'+
      '<div class="card list">'+g.items.map(x=>{
        const title=x.kind==='mileage'?(esc(x.from)+' → '+esc(x.to)):esc(x.item);
        const sub2=x.kind==='mileage'?(shortDate(x.date,x.time)+' · '+x.miles+' mi'):(shortDate(x.date,x.time)+' · '+esc(x.ttype));
        return '<div class="erow trv" onclick="openDetail(\\'travel\\',\\''+x.id+'\\')">'+
          '<div class="l"><div class="t">'+title+'</div>'+
          '<div class="s"><span class="cdot" style="background:var(--travel)"></span>'+sub2+'</div></div>'+
          '<div class="r">'+((x.photos&&x.photos.length)?'<span class="clip">📎'+x.photos.length+'</span>':'')+
          '<span class="amt">'+money(trvAmount(x))+'</span><span class="chev">›</span></div>'+
        '</div>';
      }).join('')+'</div>';
  }).join('')
    :'<div class="empty"><div class="big">🚗</div>No travel yet.<br>Tap + to add mileage or a ticket.<div class="sb"><button class="btn ghost sm" onclick="loadSamples()">Load May sample data</button></div></div>';

  // expenses list grouped by month
  const eq=(expSearch.value||'').toLowerCase();
  const el=expenses.filter(x=>!eq||(x.item+' '+x.reason).toLowerCase().includes(eq))
    .sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  expCnt.textContent=el.length+' item'+(el.length===1?'':'s');
  expList.innerHTML=el.length?groupByMonth(el).map(g=>{
    const sub=g.items.reduce((a,b)=>a+b.cost,0);
    return '<div class="mhead exp"><span>'+monthLabel(g.key)+'</span><span class="sub">'+money(sub)+'</span></div>'+
      '<div class="card list">'+g.items.map(x=>
        '<div class="erow exp" onclick="openDetail(\\'exp\\',\\''+x.id+'\\')">'+
          '<div class="l"><div class="t">'+esc(x.item)+'</div>'+
          '<div class="s"><span class="cdot" style="background:var(--expense)"></span>'+shortDate(x.date,x.time)+'</div></div>'+
          '<div class="r">'+((x.photos&&x.photos.length)?'<span class="clip">📎'+x.photos.length+'</span>':'')+
          '<span class="amt">'+money(x.cost)+'</span><span class="chev">›</span></div>'+
        '</div>').join('')+'</div>';
  }).join('')
    :'<div class="empty"><div class="big">💳</div>No expenses yet.<br>Tap + to add one.<div class="sb"><button class="btn ghost sm" onclick="loadSamples()">Load May sample data</button></div></div>';

  // reports
  const costItems=fTrv.filter(x=>x.kind==='cost');
  const milItems=fTrv.filter(x=>x.kind==='mileage');
  const costTotal=costItems.reduce((a,b)=>a+b.cost,0);
  const milMiles=milItems.reduce((a,b)=>a+b.miles,0);
  const milTotal=milMiles*rate;
  rangeLbl.textContent=(range.from||range.to)?('('+(range.from?fmtDate(range.from):'start')+' → '+(range.to?fmtDate(range.to):'now')+')'):'(all time)';
  // travel cost breakdown by ttype
  const byType={};costItems.forEach(x=>byType[x.ttype]=(byType[x.ttype]||0)+x.cost);
  reportBody.innerHTML=
    row('<span class="cdot" style="background:var(--travel)"></span> <b>Travel total ('+fTrv.length+')</b>','<b style="color:var(--travel)">'+money(trvTotal)+'</b>')+
    row('Transport costs ('+costItems.length+')',money(costTotal),true)+
    Object.entries(byType).sort((a,b)=>b[1]-a[1]).map(([k,v])=>row('&nbsp;&nbsp;'+k,money(v),true)).join('')+
    row('Mileage · '+milMiles.toFixed(1)+' mi @ '+money(rate),money(milTotal),true)+
    '<div style="border-top:1px solid var(--border);margin:10px 0"></div>'+
    row('<span class="cdot" style="background:var(--expense)"></span> <b>Expenses total ('+fExp.length+')</b>','<b style="color:var(--expense)">'+money(expTotal)+'</b>')+
    '<div style="border-top:1px solid var(--border);margin:10px 0"></div>'+
    row('<b>Grand total claim</b>','<b style="color:#a78bfa">'+money(trvTotal+expTotal)+'</b>');
  rateInput.value=rate.toFixed(2);
  buildExports(fTrv,fExp);
}
function row(l,v,small){return '<div class="settingsrow" style="margin-bottom:7px'+(small?';font-size:13px;color:var(--muted)':'')+'"><div style="display:flex;align-items:center;gap:6px">'+l+'</div><div>'+v+'</div></div>'}

function saveRate(){rate=parseFloat(rateInput.value)||0;localStorage.setItem(LS.rate,rate);render();}

// ---- Export ----
function csv(rows){return rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(',')).join('\\n')}
function rangeSuffix(){return (range.from||range.to)?('_'+(range.from||'start')+'_to_'+(range.to||'now')):'';}
function buildExports(fTrv,fExp){
  const tRows=[['Date','Time','Kind','Type','Item / Route','From','From Postcode','To','To Postcode','Miles','Rate','Amount','Reason','Photos']];
  fTrv.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).forEach(x=>{
    if(x.kind==='mileage'){
      tRows.push([x.date,x.time,'Mileage','',x.from+' → '+x.to,x.from,x.fromp,x.to,x.top,x.miles,rate.toFixed(2),(x.miles*rate).toFixed(2),x.reason,(x.photos||[]).length]);
    }else{
      tRows.push([x.date,x.time,'Transport',x.ttype,x.item,'','','','','','',x.cost.toFixed(2),x.reason,(x.photos||[]).length]);
    }
  });
  setLink('trvCsvLink',csv(tRows),'travel'+rangeSuffix()+'.csv','text/csv');

  const eRows=[['Date','Time','Item','Cost','Reason','Photos']];
  fExp.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))
    .forEach(x=>eRows.push([x.date,x.time,x.item,x.cost.toFixed(2),x.reason,(x.photos||[]).length]));
  setLink('expCsvLink',csv(eRows),'expenses'+rangeSuffix()+'.csv','text/csv');

  setLink('backupLink',JSON.stringify({travel,expenses,rate},null,2),'claim-backup.json','application/json');
}
function setLink(id,data,name,mime){
  const a=document.getElementById(id);
  const blob=new Blob([data],{type:mime});
  if(a._url)URL.revokeObjectURL(a._url);
  a._url=URL.createObjectURL(blob);a.href=a._url;a.download=name;
}
function restore(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);
    if(d.travel)travel=d.travel;if(d.expenses)expenses=d.expenses;
    if(d.rate)rate=d.rate;localStorage.setItem(LS.rate,rate);
    save();render();toast('Backup restored ✓');
  }catch{alert('Invalid backup file')}};
  r.readAsText(f);
}

// migrate old data, then seed May data on first visit / reseed once
migrate();
if(!localStorage.getItem('ct_seeded_may')){
  const s=sampleData();travel=s.trv;expenses=s.ex;save();
  localStorage.setItem(LS.seeded,'1');
  localStorage.setItem('ct_seeded_may','1');
}
setTravelKind('mileage');
render();
</script>
</body>
</html>`;