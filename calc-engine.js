(function(root){
  const n=(v,d=0)=>{const x=Number(v);return Number.isFinite(x)?Math.max(0,x):d;};
  function recommendUps(trimW,trimH,sheetW,sheetH){
    const w=n(trimW),h=n(trimH),sw=n(sheetW),sh=n(sheetH);
    if(!w||!h||!sw||!sh)return 0;
    return Math.max(Math.floor(sw/w)*Math.floor(sh/h),Math.floor(sw/h)*Math.floor(sh/w),0);
  }
  function calculatePrintJob(input){
    const q=n(input.copies), sets=n(input.setsPerCopy,1)||1, sides=Math.max(1,Math.min(2,Math.round(n(input.sides,1)||1)));
    const suggestedUps=recommendUps(input.trimW,input.trimH,input.sheetW,input.sheetH);
    const requestedUps=Math.floor(n(input.ups));
    const ups=requestedUps>0?requestedUps:suggestedUps;
    const neededBeforeWaste=ups>0?Math.ceil(q*sets/ups):0;
    const wastePct=Math.min(100,n(input.wastePct));
    const wasteSheets=Math.ceil(neededBeforeWaste*wastePct/100);
    const makeready=Math.ceil(n(input.makeready));
    const runSheets=neededBeforeWaste+wasteSheets;
    const totalSheets=runSheets+makeready;
    const impressions=totalSheets*sides;
    const pressImpressions=n(input.pressImpressions)>0?n(input.pressImpressions):impressions;
    const paper=n(input.paperUnit)*totalSheets;
    const design=n(input.designCost),prepress=n(input.prepressCost);
    let plates=0,press=0,ink=0,clicks=0;
    if(input.method==='digital'){
      clicks=impressions*Math.max(1,n(input.clicksPerSheet,1));
      press=clicks*n(input.clickUnit);
      ink=clicks*n(input.inkPerThousand)/1000;
    } else {
      plates=n(input.plateUnit)*n(input.colors)*sides;
      press=n(input.pressSetup)*sides+n(input.pressPerThousand)*pressImpressions/1000;
    }
    const lamination=n(input.laminationPerCopy)*q,foil=n(input.foilPerCopy)*q,uv=n(input.uvPerCopy)*q,binding=n(input.bindingPerCopy)*q;
    const finishSetup=n(input.finishSetup),otherDirect=n(input.otherDirect);
    const direct=paper+design+prepress+plates+press+ink+lamination+foil+uv+binding+finishSetup+otherDirect;
    const overheadFixed=n(input.overheadFixed),laborFixed=n(input.laborFixed),overheadVariable=direct*n(input.overheadPct)/100;
    const indirect=overheadFixed+laborFixed+overheadVariable;
    const cost=direct+indirect;
    const markupPct=n(input.markupPct),profit=cost*markupPct/100;
    const gross=cost+profit,discountPct=Math.min(100,n(input.discountPct)),discount=gross*discountPct/100;
    const afterDiscount=gross-discount,tax=afterDiscount*n(input.taxPct)/100,quoteTotal=afterDiscount+tax;
    return {canImpose:ups>0,suggestedUps,ups,neededBeforeWaste,wasteSheets,makeready,runSheets,totalSheets,impressions,pressImpressions,paper,design,prepress,plates,press,clicks,ink,lamination,foil,uv,binding,finishSetup,otherDirect,direct,overheadFixed,laborFixed,overheadVariable,indirect,cost,markupPct,profit,gross,discount,tax,quoteTotal,unitPrice:q?quoteTotal/q:0};
  }
  const api={recommendUps,calculatePrintJob};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.PrintCostEngine=api;
})(typeof window!=='undefined'?window:globalThis);
