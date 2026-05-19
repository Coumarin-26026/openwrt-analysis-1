'use strict';'require baseclass';'require rpc';'require network';var callLuciDHCPLeases=rpc.declare({object:'luci-rpc',method:'getDHCPLeases',expect:{'':{}}});return baseclass.extend({title:_('DHCP Devices'),params:{},load(){return Promise.all([callLuciDHCPLeases(),]);},renderHtml(){const container_wapper=E('div',{'class':'router-status-lan dashboard-bg box-s1'});const container_box=E('div',{'class':'lan-info devices-list','style':'padding: 1.5em;'});container_box.appendChild(E('div',{'class':'title','style':'text-align: center; margin-bottom: 20px;'},[E('img',{'src':L.resource('view/dashboard/icons/devices.svg'),'width':55,'title':this.title,'class':'middle svgmonotone','style':'display: inline-block; vertical-align: middle; margin-right: 10px;'}),E('h3',{'style':'display: inline-block; vertical-align: middle; margin: 0;'},this.title)]));const container_devices_wrapper=E('div',{'class':'lan-clients-wrapper','style':'width: 100%; overflow: hidden;'});const dynamicStyles=E('style',{},`
   .lan-flex-table .col-host { flex: 1 1 30%; }
   .lan-flex-table .col-mac { flex: 1 1 25%; padding: 0 10px; }
   .lan-flex-table .col-ip { flex: 1 1 25%; padding: 0 10px; }
   .lan-flex-table .col-exp { flex: 1 1 20%; text-align: right; }

   /* 手机端 2x2 网格卡片重组 */
   @media screen and (max-width: 800px) {
    .lan-flex-table .tbody-row {
     flex-wrap: wrap !important;
     flex-direction: row !important;
    }
    .lan-flex-table .td {
     width: auto !important;
     padding: 0 !important;
     align-self: center;
    }

    /* Row 1: 主机名 (左) + IP地址 (右) */
    .lan-flex-table .col-host {
     order: 1; flex: 1 1 60% !important;
     border-bottom: 1px dashed rgba(0,0,0,0.1);
     padding-bottom: 8px !important; margin-bottom: 8px !important;
    }
    .lan-flex-table .col-ip {
     order: 2; flex: 1 1 40% !important; text-align: right !important;
     border-bottom: 1px dashed rgba(0,0,0,0.1);
     padding-bottom: 8px !important; margin-bottom: 8px !important;
    }

    /* Row 2: MAC (左) + 租期 (右) */
    .lan-flex-table .col-mac {
     order: 3; flex: 1 1 50% !important;
     font-size: 11px !important;
    }
    .lan-flex-table .col-exp {
     order: 4; flex: 1 1 50% !important; text-align: right !important;
     font-size: 11px !important;
    }

    /* 表尾统计行修复 */
    .lan-flex-table .tfoot { flex-direction: row !important; }
    .lan-flex-table .tfoot .col-host { flex: 1 1 50% !important; border: none !important; margin: 0 !important; padding: 12px 8px !important; order: 1; }
    .lan-flex-table .tfoot .col-exp { flex: 1 1 50% !important; border: none !important; margin: 0 !important; padding: 12px 8px !important; order: 2; }
   }
  `);container_wapper.appendChild(dynamicStyles);const table=E('div',{'class':'modern-flex-table lan-flex-table'},[E('div',{'class':'tr thead dashboard-bg hide-xs'},[E('div',{'class':'th col-host'},_('Hostname')),E('div',{'class':'th col-mac'},_('MAC')),E('div',{'class':'th col-ip'},_('IP Address')),E('div',{'class':'th col-exp'},_('Lease time'))])]);for(let i=0;i<this.params.lan.devices.length;i++){const device=this.params.lan.devices[i];const row=E('div',{'class':`tr tbody-row ${i % 2 ? 'cbi-rowstyle-2' : 'cbi-rowstyle-1'}`},[E('div',{'class':'td col-host'},[E('div',{'class':'device-name','style':'font-weight: 600;'},device.hostname)]),E('div',{'class':'td col-mac','style':'font-family: monospace; font-size: 13px; color: #6c757d;'},device.macaddr),E('div',{'class':'td col-ip','style':'font-family: monospace; font-size: 15px;'},[E('strong',{},device.ipv4)]),E('div',{'class':'td col-exp','style':'font-size: 13px; color: #6c757d;'},[E('span',{'style':'opacity: 0.8; margin-right: 2px;'},'⏳ '),device.expires])]);table.appendChild(row);}
table.appendChild(E('div',{'class':'tr tfoot dashboard-bg','style':'border-top: 2px solid rgba(0,0,0,0.1);'},[E('div',{'class':'td col-host'},E('strong',_('Total')+'：')),E('div',{'class':'td col-mac hide-xs'},''),E('div',{'class':'td col-ip hide-xs'},''),E('div',{'class':'td col-exp'},E('strong',this.params.lan.devices.length))]));container_devices_wrapper.appendChild(table);container_box.appendChild(container_devices_wrapper);container_wapper.appendChild(container_box);return container_wapper;},renderUpdateData(leases){const dev_arr=[];leases.forEach(({hostname='?',ipaddr:ipv4='-',macaddr='00:00:00:00:00:00',expires})=>{let expNode;if(expires===false)
expNode=E('em',_('unlimited'));else if(expires<=0)
expNode=E('em',_('expired'));else
expNode='%t'.format(expires);dev_arr.push({hostname,ipv4,macaddr,expires:expNode});});this.params.lan={devices:dev_arr};},renderLeases(leases){this.renderUpdateData([...leases.dhcp_leases]);return this.renderHtml();},render([leases]){if(L.hasSystemFeature('dnsmasq')||L.hasSystemFeature('odhcpd'))
return this.renderLeases(leases);return E([]);}});