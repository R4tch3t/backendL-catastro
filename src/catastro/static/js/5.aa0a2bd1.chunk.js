(window["webpackJsonpmaterial-dashboard-react"]=window["webpackJsonpmaterial-dashboard-react"]||[]).push([[5],{343:function(e,a,t){"use strict";var n=t(4),r=t(7),l=t(1);a.a=function(e){var a;return{wrapper:{position:"relative",top:"0",height:"100vh"},mainPanel:Object(r.a)(Object(r.a)((a={},Object(n.a)(a,e.breakpoints.up("md"),{width:"calc(100% - ".concat(l.i,"px)")}),Object(n.a)(a,"overflow","auto"),Object(n.a)(a,"position","relative"),Object(n.a)(a,"float","right"),a),l.x),{},{maxHeight:"100%",width:"100%",overflowScrolling:"touch"}),content:{marginTop:"70px",padding:"30px 15px",minHeight:"calc(100vh - 123px)"},container:l.c,map:{marginTop:"70px"}}}},347:function(e,a,t){"use strict";t.r(a);var n=t(13),r=t(0),l=t.n(r),o=t(74),i=t(157),c=(t(200),t(83)),s=t(4),m=t(14),d=t.n(m),u=t(290),p=t(291),h=t(137),b=t(162),v=t.n(b),w=t(113),g=t(158),f=t.n(g),y=t(120),E=t(152),x=t(288),O=t(193),j=t(151),N=t(194),k=t(286),S=t(289),C=t(85),I=t.n(C),T=(t(11),t(22)),A=t(8),P=t.n(A),L=t(15),W=t(43),R=t(44),z=t(46),B=t(45);l.a.Component;var U=t(21),F=t.n(U),D=function(e){Object(z.a)(t,e);var a=Object(B.a)(t);function t(e){var n;return Object(W.a)(this,t),(n=a.call(this,e)).state={root:null,userType:null,classes:null},n.newM=function(e,a){var t=n.props.classes;return l.a.createElement(E.a,{key:a,className:t.dropdownItem,onClick:n.setAdmin()},e)},n.setAdmin=function(){return function(e){F.a.remove("idRol",{path:"/"}),F.a.save("idRol",1,{path:"/"}),window.history.pushState(null,"Administrador","#/admin/creditos"),window.history.go()}},n.obtenerU=Object(L.a)(P.a.mark((function e(){var a,t,r,l;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=F.a.load("idUsuario"),t=F.a.load("pass"),"http://34.66.54.10:3012/",r={idUsuario:a,pass:t},e.next=7,fetch("http://34.66.54.10:3012/",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(r)});case 7:return l=e.sent,e.next=10,l.json().then((function(e){if(void 0!==e[0]&&"".concat(e[0].idUsuario)==="".concat(a)&&1===e[0].idRol){var t=new Array,r=n.newM("Administrador","1");t.push(r),n.setState({root:t})}}));case 10:e.sent,e.next=16;break;case 13:e.prev=13,e.t0=e.catch(0),console.log("Error: ".concat(e.t0));case 16:case"end":return e.stop()}}),e,null,[[0,13]])}))),n.state={root:null,userType:e.userType,classes:e.classes},n.obtenerU(),n}return Object(R.a)(t,[{key:"render",value:function(){return this.state.root}}]),t}(l.a.Component),M=t(163),J=Object(c.a)(M.a);function H(){var e=J(),a=l.a.useState(null),t=Object(n.a)(a,2),r=t[0],o=t[1],i=l.a.useState(null),c=Object(n.a)(i,2),m=(c[0],c[1],function(){o(null)}),u=function(){Object(y.a)(),window.history.pushState(null,"Accesar","#/inicio/acceso"),window.history.go()},p=function(){window.history.pushState(null,"Perfil","#/usuario/perfil"),window.history.go()};return l.a.createElement("div",null,l.a.createElement("div",{className:e.manager,style:{zIndex:99999}},l.a.createElement(T.a,{color:window.innerWidth>959?"transparent":"white",justIcon:window.innerWidth>959,simple:!(window.innerWidth>959),"aria-owns":r?"profile-menu-list-grow":null,"aria-haspopup":"true",onClick:function(e){r&&r.contains(e.target)?o(null):o(e.currentTarget)},className:e.buttonLink},l.a.createElement(I.a,{className:e.icons}),l.a.createElement(w.a,{mdUp:!0,implementation:"css"},l.a.createElement("p",{className:e.linkText},"Perfil"))),l.a.createElement(k.a,{open:Boolean(r),anchorEl:r,transition:!0,disablePortal:!0,className:d()(Object(s.a)({},e.popperClose,!r))+" "+e.popperNav},(function(a){var t=a.TransitionProps,n=a.placement;return l.a.createElement(O.a,Object.assign({},t,{id:"profile-menu-list-grow",style:{transformOrigin:"bottom"===n?"center top":"center bottom"}}),l.a.createElement(j.a,null,l.a.createElement(N.a,{onClickAway:m},l.a.createElement(x.a,{role:"menu"},l.a.createElement(E.a,{onClick:p,className:e.dropdownItem},"Editar perfil"),l.a.createElement(D,{classes:e}),l.a.createElement(S.a,{light:!0}),l.a.createElement(E.a,{onClick:u,className:e.dropdownItem},"Cerrar sesi\xf3n")))))}))))}var _=t(114),X=t(165),Y=Object(c.a)(X.a);function q(e){var a=Y();var t=e.color,n=d()(Object(s.a)({}," "+a[t],t));return l.a.createElement(u.a,{className:a.appBar+n},l.a.createElement(p.a,{className:a.container},l.a.createElement("div",{className:a.flex},l.a.createElement("img",{style:{position:"relative",width:"100%",height:90},src:v.a})),l.a.createElement(w.a,{smDown:!0,implementation:"css"},e.rtlActive?l.a.createElement(_.a,null):l.a.createElement(H,null)),l.a.createElement(w.a,{mdUp:!0,implementation:"css"},l.a.createElement(h.a,{color:"inherit","aria-label":"open drawer",onClick:e.handleDrawerToggle},l.a.createElement(f.a,null)))))}var G=t(160),K=t(139),Q=t(199),V=t(195),Z=t(196),$=t(293),ee=t(292),ae=t(154),te=t.n(ae),ne=t(167),re=t.n(ne),le=t(168),oe=t.n(le),ie=t(166),ce=Object(c.a)(ie.a);function se(e){var a=ce(),t=l.a.createRef(),r=l.a.useState(0),o=Object(n.a)(r,2),i=o[0],c=o[1];function m(e){return window.location.href.indexOf(e)>-1}var u=e.color,p=e.image,b=e.logoText,v=e.routes,g=l.a.createElement(V.a,{className:a.list},v.map((function(t,n){var r,o=" ";"/upgrade-to-pro"===t.path?(o=a.activePro+" ",r=d()(Object(s.a)({}," "+a[u],!0))):r=d()(Object(s.a)({}," "+a[u],m(t.layout+t.path)));var i=d()(Object(s.a)({}," "+a.whiteFont,m(t.layout+t.path)));return l.a.createElement(K.NavLink,{to:t.layout+t.path,className:o+a.item,activeClassName:"active",key:n},l.a.createElement(Z.a,{button:!0,className:a.itemLink+r},"string"===typeof t.icon?l.a.createElement(ee.a,{className:d()(a.itemIcon,i,Object(s.a)({},a.itemIconRTL,e.rtlActive))},t.icon):l.a.createElement(t.icon,{className:d()(a.itemIcon,i,Object(s.a)({},a.itemIconRTL,e.rtlActive))}),l.a.createElement($.a,{primary:e.rtlActive?t.rtlName:t.name,className:d()(a.itemText,i,Object(s.a)({},a.itemTextRTL,e.rtlActive)),disableTypography:!0})))}))),f=l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:a.logo,style:{color:"white"}},l.a.createElement("div",{className:a.logoImage,style:{display:"inline-block",cursor:"pointer"}},l.a.createElement(te.a,null)),l.a.createElement("div",{style:{position:"absolute",top:15,left:93}},b),window.innerWidth>=960&&i<2&&l.a.createElement("div",{className:a.logoImage,style:{position:"absolute",cursor:"pointer",right:0}},l.a.createElement(re.a,{onClick:function(){var a=t.current.children[1].children[0].children[0],n=t.current.nextSibling;e.bandFadeSide[0]=!1;var r=document.getElementById("sideBtn");r.style.display="block",r.style.zIndex=9999,a.style.position="relative",t.current.classList.toggle("fade-active"),n.style.position="absolute",n.style.left="0px",n.style.width="100%"}}))));return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{id:"sideBtn",style:{position:"absolute",display:"none",left:0,zIndex:9999}},l.a.createElement(h.a,{color:"inherit","aria-label":"open drawer",onClick:function(){var a=t.current.nextSibling;a.style.left="260px",a.style.width=window.innerWidth-260+"px",e.bandFadeSide[0]=!0,document.getElementById("sideBtn").style.display="none",t.current.classList.toggle("fade-active"),c(0===i?1:0)}},l.a.createElement(oe.a,null))),l.a.createElement("div",{ref:t,className:"fadeIN"},l.a.createElement(w.a,{mdUp:!0,implementation:"css"},l.a.createElement(Q.a,{variant:"temporary",anchor:e.rtlActive?"left":"right",open:e.open,classes:{paper:d()(a.drawerPaper,Object(s.a)({},a.drawerPaperRTL,e.rtlActive))},onClose:e.handleDrawerToggle,ModalProps:{keepMounted:!0}},f,l.a.createElement("div",{className:a.sidebarWrapper},e.rtlActive?l.a.createElement(_.a,null):l.a.createElement(H,null),g),void 0!==p?l.a.createElement("div",{className:a.background,style:{backgroundImage:"url("+p+")"}}):null)),l.a.createElement(w.a,{smDown:!0,implementation:"css"},l.a.createElement(Q.a,{anchor:e.rtlActive?"right":"left",variant:"permanent",open:!0,classes:{paper:d()(a.drawerPaper,Object(s.a)({},a.drawerPaperRTL,e.rtlActive))}},f,l.a.createElement("div",{className:a.sidebarWrapper},g),void 0!==p?l.a.createElement("div",{className:a.background,style:{backgroundImage:"url("+p+")"}}):null))))}var me,de=t(159),ue=t(87),pe=t.n(ue),he=t(181),be=t(183),ve=t(182),we=t(184),ge=t(185),fe=[{path:"/orden",name:"Orden de pago",rtlName:"\u0644\u0648\u062d\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629",icon:pe.a,component:he.a,layout:"/usuario"},{path:"/padron",name:"Lista de Contribuyentes",rtlName:"\u0644\u0648\u062d\u0629 \u0627\u0644\u0642\u064a\u0627\u062f\u0629",icon:pe.a,component:ve.a,layout:"/usuario"},{path:"/registrarPredio",name:"Registrar Contribuyente",rtlName:"\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062c\u062f\u0648\u0644",icon:"content_paste",component:we.a,layout:"/usuario"},{path:"/actualizarPredio",name:"Actualizar Contribuyente",rtlName:"\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062c\u062f\u0648\u0644",icon:"content_paste",component:ge.a,layout:"/usuario"},{path:"/perfil",name:"Perfil de usuario",rtlName:"\u0645\u0644\u0641 \u062a\u0639\u0631\u064a\u0641\u064a \u0644\u0644\u0645\u0633\u062a\u062e\u062f\u0645",icon:I.a,component:be.a,layout:"/usuario"}],ye=t(343),Ee=t(100),xe=t.n(Ee);t.d(a,"Usuario",(function(){return Ne}));var Oe=l.a.createElement(o.g,null,fe.map((function(e,a){return"/usuario"===e.layout?l.a.createElement(o.d,{path:e.layout+e.path,component:e.component,key:a}):null})),l.a.createElement(o.c,{from:"/",to:"/usuario/padron"})),je=Object(c.a)(ye.a),Ne=function(e){var a=Object.assign({},e),t=[!0],r="",o=0;window.innerWidth>=960&&(r="absolute",o=260);var c=je(),s=l.a.createRef(),m=l.a.useState(xe.a),d=Object(n.a)(m,2),u=d[0],p=d[1],h=l.a.useState("blue"),b=Object(n.a)(h,2),v=b[0],w=b[1],g=l.a.useState("dropdown"),f=Object(n.a)(g,2),y=f[0],E=f[1],x=l.a.useState(!1),O=Object(n.a)(x,2),j=O[0],N=O[1],k=function(){N(!j)},S=function(){return"/admin/maps"!==window.location.pathname},C=function(){var e=document.getElementById("sideBtn");window.innerWidth>=960?(e.style.display="block",t[0]?(e.nextSibling.nextSibling.style.left="260px",e.nextSibling.nextSibling.style.width=window.innerWidth-260+"px",e.style.zIndex=0):e.style.zIndex=9999,N(!1)):(e.style.display="none",e.style.zIndex=0,e.nextSibling.nextSibling.style.left="0",e.nextSibling.nextSibling.style.width="100%")};return l.a.useEffect((function(){return navigator.platform.indexOf("Win")>-1&&(me=new i.a(s.current,{suppressScrollX:!0,suppressScrollY:!1}),document.body.style.overflow="hidden"),window.addEventListener("resize",C),function(){navigator.platform.indexOf("Win")>-1&&me.destroy(),window.removeEventListener("resize",C)}}),[s]),l.a.createElement("div",{className:c.wrapper},l.a.createElement(se,Object.assign({routes:fe,logoText:"Bienvenido",logo:te.a,image:u,handleDrawerToggle:k,open:j,color:v,bandFadeSide:t},a)),l.a.createElement("div",{className:c.mainPanel,style:{position:r,left:o},ref:s},l.a.createElement(q,Object.assign({routes:fe,handleDrawerToggle:k},a)),S()?l.a.createElement("div",{className:c.content},l.a.createElement("div",{className:c.container},Oe)):l.a.createElement("div",{className:c.map},Oe),S()?l.a.createElement(G.a,null):null,l.a.createElement(de.a,{handleImageClick:function(e){p(e)},handleColorClick:function(e){w(e)},bgColor:v,bgImage:u,handleFixedClick:function(){E("dropdown"===y?"dropdown show":"dropdown")},fixedClasses:y})))}}}]);