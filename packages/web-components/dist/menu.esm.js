import e,{useState as n}from"react";import{IoChevronDownSharp as o}from"react-icons/io5";var l={menu:"_menu-module__menu__332E-",item:"_menu-module__item__2Bvg1",dropdown:"_menu-module__dropdown__1NZ_L",dropdownIsActive:"_menu-module__dropdownIsActive__1UGSx",dropdownItem:"_menu-module__dropdownItem__5MA2i",dropdownItemIsDisabled:"_menu-module__dropdownItemIsDisabled__24PhY",dropdownDivider:"_menu-module__dropdownDivider__3ZhCZ",dropdownHeader:"_menu-module__dropdownHeader__vSB7u",dropdownMask:"_menu-module__dropdownMask__DIH_T",dropdownMaskIsActive:"_menu-module__dropdownMaskIsActive__1MXDw"};function d(n){var o=n.children,d=void 0===o?null:o,r=n.active;return e.createElement("div",{className:[l.dropdown,void 0!==r&&r?l.dropdownIsActive:""].join(" ")},d)}function r(n){var o=n.label,d=void 0===o?null:o,r=n.href,t=void 0===r?null:r,i=n.tooltip,a=void 0===i?null:i,u=n.icon,c=void 0===u?null:u,m=n.disabled,_=n.onClick,v=void 0===_?function(){return!0}:_;return e.createElement("div",{className:[l.dropdownItem,void 0!==m&&m?l.dropdownItemIsDisabled:""].join(" ")},e.createElement("a",{href:t,onClick:v,title:a,target:t?"_blank":""},e.createElement("span",null,c?c():""),e.createElement("span",null,d)))}function t(n){return function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(n),e.createElement("div",{className:l.dropdownDivider})}function i(n){var o=n.active,d=n.onClick,r=void 0===d?function(){}:d;return e.createElement("div",{className:[l.dropdownMask,void 0!==o&&o?l.dropdownMaskIsActive:""].join(" "),onClick:r})}function a(n){var o=n.label;return e.createElement("div",{className:l.dropdownHeader},void 0===o?null:o)}function u(n){var r=n.label,t=void 0===r?null:r,i=n.tooltip,a=void 0===i?null:i,u=n.children,c=void 0===u?null:u,m=n.dropdown,_=void 0===m?null:m,v=n.active,s=void 0!==v&&v,p=n.onClick;return e.createElement("div",{onClick:void 0===p?function(){return!0}:p,className:[l.item].join(" ")},c||e.createElement("a",{title:a},t,e.createElement(o,null)),_?e.createElement(d,{active:s},_()):"")}function c(o){var d=o.children,r=void 0===d?null:d,t=o.items,a=void 0===t?[]:t,c=n(null),m=c[0],_=c[1];return e.createElement("div",{className:[l.menu].join(" ")},a.map(function(n){return e.createElement(u,{key:n.label,label:n.label,dropdown:function(){return n.dropdown({controller:controller})},active:m===n.label,onClick:function(){_(m===n.label?null:n.label)}})}),e.createElement("div",{onClick:function(){return _(null)},style:{flex:1}}),r,e.createElement(i,{onClick:function(){return _(null)},active:!!m}))}export{c as Menu,t as MenuDropdownDivider,a as MenuDropdownHeader,r as MenuDropdownItem,i as MenuDropdownMask,u as MenuItem};
//# sourceMappingURL=menu.esm.js.map