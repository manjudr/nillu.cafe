import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

// Use the supplied stacked mark; the tiny vertical cafe suffix is omitted only
// in tab icons. An opaque white tile keeps the black artwork clear on dark tabs.
const block=await sharp('src/assets/logo-ink.png').extract({left:188,top:0,width:1116,height:1148}).png().toBuffer()
const icon=async(size)=>sharp(block).resize(size-4,size-4,{fit:'contain',background:'#fff'}).flatten({background:'#fff'}).extend({top:2,bottom:2,left:2,right:2,background:'#fff'}).png().toBuffer()
for(const size of [16,32,48,180,192,512])await writeFile(size===512?'public/icon.png':`public/favicon-${size}.png`,await icon(size))
const sizes=[16,32,48],images=await Promise.all(sizes.map(icon)),header=Buffer.alloc(6+16*sizes.length)
header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4)
let offset=header.length
sizes.forEach((size,i)=>{const at=6+16*i;header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(images[i].length,at+8);header.writeUInt32LE(offset,at+12);offset+=images[i].length})
await writeFile('public/favicon.ico',Buffer.concat([header,...images]))
