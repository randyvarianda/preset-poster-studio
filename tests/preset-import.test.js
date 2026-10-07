'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {decodePocketMasterPreset}=require('../preset-import.js');
function fixture(){
 const b=Buffer.alloc(500);b.write('Pocket Master');b.write('Test tone',25);
 let offset=64;
 function field(tag,data){b.writeUInt16LE(tag,offset);b.writeUInt16LE(data.length,offset+2);data.copy(b,offset+4);offset+=data.length+4;}
 const mask=Buffer.alloc(4);mask.writeUInt32LE(447);field(0x3001,mask);
 field(0x3002,Buffer.from([0,1,6,2,3,4,5,7,8,9]));
 const models=Buffer.alloc(40);[27,1,0x03000000,0x0700002f,0x0a000022,0x01000035,26,0x0b000014,0x0c000004,0x0f000000].forEach((id,i)=>models.writeUInt32LE(id,i*4));field(0x3003,models);
 const values=Buffer.alloc(320);[[40],[42,55,39,10],[40,59,50],[40,50,50,54,59,59,36],[50],[-1,2,17,21,20,58],[20,0,0],[16,192,18],[18,23,50]].forEach((row,i)=>row.forEach((v,j)=>values.writeFloatLE(v,i*32+j*4)));field(0x3004,values);return b;
}
const bytes=fixture(),preset=decodePocketMasterPreset(bytes);
const app=fs.readFileSync(require.resolve('../app.js'),'utf8'),context={structuredClone};vm.createContext(context);
vm.runInContext(app.slice(0,app.indexOf('let effects='))+app.slice(app.indexOf('function importedEffects('),app.indexOf("$('presetFile').onchange="))+';globalThis.convert=importedEffects;',context);
function verify(p){
 const effects=context.convert(p),find=id=>effects.find(e=>e.id===id);
 assert.equal(find('DRV').model,'Scream');assert.equal(find('AMP').model,'Brit50 JP');assert.equal(find('FX2').on,false);assert.equal(find('RVB').model,'Spring');
 assert.equal(find('AMP').params.find(p=>p[0]==='Gain 2')[1],36);
 assert.equal(find('DLY').params.find(p=>p[0]==='Time')[1],192);
 assert.equal(find('EQ').params[0][1],-1);
 assert.equal(effects.filter(e=>e.on).length,8);
 assert.equal(effects.map(e=>e.id).join(','),'NR,FX1,FX2,DRV,AMP,IR,EQ,DLY,RVB');
}
verify(preset);assert.equal(preset.name,'Test tone');
assert.throws(()=>decodePocketMasterPreset(bytes.subarray(0,200)));
assert.throws(()=>decodePocketMasterPreset(Buffer.alloc(515)));
const badFloat=fixture();badFloat.writeFloatLE(NaN,138);assert.throws(()=>decodePocketMasterPreset(badFloat));
const clone=fixture();clone.writeUInt32LE(512,68);assert.throws(()=>decodePocketMasterPreset(clone),/Clone/);
const unknown=structuredClone(preset);unknown.modules[2].model=null;assert.throws(()=>context.convert(unknown),/Unsupported/);
if(process.argv[2]){const actual=decodePocketMasterPreset(fs.readFileSync(process.argv[2]));verify(actual);assert.equal(actual.name,'Jpn Drive');}
console.log('PASS: binary settings, parameter slot order, bypass, signal chain, malformed files, Clone and unsupported models');

