chrome.contextMenus.create({
	title: chrome.i18n.getMessage('contextMenu'),
	contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener(function ( tab ) {
	chrome.tabs.executeScript(tab.id, {
		file: 'scripts/out/hascheck.js'
	});
	chrome.tabs.insertCSS(tab.id, {
		file: 'styles/out/hascheck.css'
	});
});
