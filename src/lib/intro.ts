export const BOOT_STORAGE_KEY = "fda-boot";
export const BOOT_PLAYING = "playing";
export const BOOT_DONE = "done";

export const BOOT_SCRIPT = `(function(){var root=document.documentElement;try{var storage=sessionStorage;if(storage.getItem("${BOOT_STORAGE_KEY}")){storage.setItem("${BOOT_STORAGE_KEY}","${BOOT_DONE}");root.dataset.boot="off"}else{storage.setItem("${BOOT_STORAGE_KEY}","${BOOT_PLAYING}")}}catch(error){root.dataset.boot="off"}})()`;
