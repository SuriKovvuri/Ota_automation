import { logger } from "../log.setup";

export class Branding {

    constructor() {
        logger.info('CLass BRANDING constructor.')
    }
    ConfigureBranding(dark_logo_url, light_logo_url, favo_icon_url, login_bg_url, theme, from_email_address, font_family_url) {
        this.dark_logo_url = dark_logo_url
        this.from_email_address = from_email_address
        this.light_logo_url = light_logo_url
        this.favo_icon_url = favo_icon_url
        this.login_bg_url = login_bg_url
        this.theme = theme
        this.font_family_url = font_family_url
    }

    get_dark_logo_url() {
        return this.dark_logo_url
    }
    get_from_email_address() {
        return this.from_email_address
    }
    get_light_logo_url() {
        return this.light_logo_url
    }
    get_favo_icon_url() {
        return this.favo_icon_url
    }
    get_login_bg_url() {
        return this.login_bg_url
    }
    get_theme() {
        return this.theme
    }
    get_font_family_url() {
        return this.font_family_url
    }

}