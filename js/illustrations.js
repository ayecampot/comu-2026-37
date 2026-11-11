const art = {
  bridge: '<path d="M24 149h252M45 149V63m210 86V63M45 80c45 88 165 88 210 0M75 116v33m36-14v14m39-9v9m39-14v14m36-33v33"/><path d="M134 46v24m-12-12h24"/><circle cx="75" cy="51" r="4"/><circle cx="226" cy="47" r="4"/>',
  voices: '<path d="M30 40h158v89h-67l-30 25v-25H30z"/><path d="M201 78h67v86h-34l-22 18v-18h-53v-20"/><path d="M58 71h102M58 89h73M58 107h86M211 106h34m-58 22h58"/>',
  waves: '<path d="M25 101h12m9-17v34m12-51v68m14-77v86m14-100v114m14-89v65m14-76v87m14-111v136m14-102v68m14-85v102m14-119v136m14-102v68m14-85v102m14-76v50m14-64v76m14-56v36m14-27h12"/>',
  stairs: '<path d="M39 163h225M61 162v-31h41V98h41V65h41V32h53v131M45 57l19-19m-19 0h19v19"/><path d="M95 49h10m-5-5v10"/>',
  sun: '<circle cx="150" cy="101" r="48"/><path d="M150 22v17m0 124v17M71 101h17m124 0h17M94 45l12 12m88 88 12 12M94 157l12-12m88-88 12-12M123 86v8m54-8v8m-46 24q19 18 38 0"/>',
  plant: '<path d="M126 173h48l10-50h-68l10 50ZM150 122V46m0 56c-35 0-58-21-58-47 35 0 58 20 58 47Zm0-20c35 0 58-21 58-47-35 0-58 20-58 47ZM84 172h132"/><path d="M226 91v22m-11-11h22M76 27v15m-8-8h16"/>',
};
export function illustration(name) {
  return `<svg viewBox="0 0 300 200" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[name] || art.waves}</svg>`;
}
