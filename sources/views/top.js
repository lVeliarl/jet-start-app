import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "header",
			localId: "header",
			template: this.app.config.name,
			css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "mdi mdi-account-group"},
				{value: "Activities", id: "activities", icon: "mdi mdi-calendar-month"},
				{value: "Settings", id: "settings", icon: "mdi mdi-cogs"}
			]
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{cols: [
					{
						rows: [menu]
					},
					{
						type: "wide",
						rows: [
							{$subview: true}
						]
					}
				]}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}

	urlChange() {
		let currentPage = this.getUrl()[1].page;
		this.$$("header").setHTML(currentPage.charAt(0).toUpperCase() + currentPage.slice(1));
	}
}
