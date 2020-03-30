import PerfectScrollbar from 'perfect-scrollbar';
import {mediaBreakpointUp, mediaBreakpointDown} from './_breakpoints';

/**
 * Perfect Scrollbar
 */
const target = document.querySelector('#sidebar-scrollable-area');
const mainSidebar = document.querySelector('#main-sidebar');
const pushArea = document.querySelectorAll('.sidebar-push-scrollable-area');
let pushAreaTotal = 0;

const setSidebarScrollableAreaHeight = (pushArea, pushAreaTotal, target, mainSidebar) => {
	if(pushArea) {
		pushArea.forEach(el => {
			pushAreaTotal += el.clientHeight;
		});
	}

	target.style.height = `${mainSidebar.clientHeight - pushAreaTotal}px`;
}

setSidebarScrollableAreaHeight(pushArea, pushAreaTotal, target, mainSidebar);

window.addEventListener('resize', () => {
	setSidebarScrollableAreaHeight(pushArea, pushAreaTotal, target, mainSidebar);
});

const ps = new PerfectScrollbar(target, {
	wheelSpeed: .5,
});

/**
 * Dropdown
 */

const sidebarMenu = document.querySelector('#sidebar-menu');
const sidebarMenuDropdowns = document.querySelectorAll('.nav-item-dropdown');

const clearActiveState = (ref) => {
	const closeTheDropdown = (link) => {
		link.classList.remove('active');
		link.classList.remove('nav-item-dropdown-active');
		link.querySelector('.sidebar-dropdown-menu').style.height = 0;
	}

	if(ref instanceof NodeList) {
		ref.forEach(link => {
			closeTheDropdown(link);
		});
	}else{
		closeTheDropdown(ref);
	}
}

sidebarMenuDropdowns.forEach((item) => {
	let theDropdownElement = item.querySelector('.sidebar-dropdown-menu');
	let dropdownHeightCalculation = ((dropdownLinks, totalHeight) => {
		dropdownLinks.forEach(link => {
			totalHeight += link.clientHeight;
		});

		return totalHeight;
	})(theDropdownElement.querySelectorAll('.nav-link'), 0);

	if(item.classList.contains('nav-item-dropdown-active')) {
		theDropdownElement.style.height = `${dropdownHeightCalculation}px`;
	}

	item.querySelector('.nav-link').addEventListener('click', (e) => {
		e.preventDefault();

		if(item.classList.contains('nav-item-dropdown-active')) {
			return clearActiveState(item);
		}

		clearActiveState(sidebarMenuDropdowns);

		if(!item.classList.contains('nav-item-dropdown-active')) {
			item.classList.add('nav-item-dropdown-active'); // important
			item.classList.add('active'); // optional
			theDropdownElement.style.height = `${dropdownHeightCalculation}px`;
		}
	});
});

/**
 * Toggler
 */

const sidebarToggler = document.querySelectorAll('[data-toggle=sidebar]');
const mainContent = document.querySelector('#main-content');
const mainNavbar = document.querySelector('#main-navbar');

const sidebarMini = () => {
	mainSidebar.classList.add('sidebar-mini');
	mainContent.classList.add('content-width-expand');
	mainNavbar.classList.add('navbar-width-expand');
}

const sidebarExpand = () => {
	mainSidebar.classList.remove('sidebar-mini');
	mainContent.classList.remove('content-width-expand');
	mainNavbar.classList.remove('navbar-width-expand');
}

const sidebarHide = () => {
	mainSidebar.classList.remove('sidebar-mini');
	mainContent.classList.remove('content-width-expand');
	mainNavbar.classList.remove('navbar-width-expand');
}

sidebarToggler.forEach(toggle => {
	toggle.addEventListener('click', (e) => {
		e.preventDefault();

		const removeBackdrop = () => {
			const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
			if(sidebarBackdrop) {

				sidebarBackdrop.remove();
			}
		}

		const addBackdrop = () => {
			if(document.querySelector('.sidebar-backdrop')) removeBackdrop();

			const backdrop = document.createElement('div');
			backdrop.className = 'sidebar-backdrop';

			document.body.appendChild(backdrop);
		}

		const toggleBackdrop = () => {
			const sidebarBackdrop = document.querySelector('.sidebar-backdrop');

			if(sidebarBackdrop) {
				removeBackdrop();
			}
			else {
				addBackdrop();
			}
		}

		const toggleClass = () => {
			let sidebarClass = 'sidebar-mini';

			if(mediaBreakpointDown('md')) {
				sidebarClass = 'sidebar-show';
			}

			mainSidebar.classList.toggle(sidebarClass);
			mainContent.classList.toggle('content-width-expand');
			mainNavbar.classList.toggle('navbar-width-expand');
		}

		toggleBackdrop();

		toggleClass();
	});
});

/**
 * Responsiveness
 */

const breakpointCheck = () => {
	if(mediaBreakpointUp('xl')) {
		sidebarExpand();
	}
	else if(mediaBreakpointUp('lg')) {
		sidebarMini();
	}

	if(mediaBreakpointDown('md')) {
		sidebarHide();
	}
}

breakpointCheck();

window.addEventListener('resize', breakpointCheck);