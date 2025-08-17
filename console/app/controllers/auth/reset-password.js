import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class AuthResetPasswordController extends Controller {
    @service fetch;
    @service notifications;
    @service router;
    @service intl;

    /**
     * The code param.
     *
     * @memberof AuthResetPasswordController
     */
    @tracked code;

    /**
     * Users new password.
     *
     * @memberof AuthResetPasswordController
     */
    @tracked password;

    /**
     * Users new password confirmation.
     *
     * @memberof AuthResetPasswordController
     */
    @tracked password_confirmation;

    /**
     * Query parameters.
     *
     * @memberof AuthResetPasswordController
     */
    queryParams = ['code'];

    /**
     * The reset password task.
     *
     * @memberof AuthResetPasswordController
     */
    @task *resetPassword(event) {
        event.preventDefault();

        const { code, password, password_confirmation } = this;
        const { id } = this.model;

        try {
            yield this.fetch.post('auth/reset-password', { link: id, code, password, password_confirmation });
        } catch (error) {
            return this.notifications.serverError(error);
        }

        this.notifications.success(this.intl.t('auth.reset-password.success-message'));
        yield this.router.transitionTo('auth.login');
    }
}
