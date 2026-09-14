<?php
/**
 * Brochure form AJAX handler.
 *
 * Copy this file content into the active WordPress theme functions.php
 * or include it from the theme.
 */

function ifc_hanoi_submit_brochure_form()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        wp_send_json_error(array('message' => 'Invalid request method.'));
    }

    $name = isset($_POST['name']) ? sanitize_text_field(wp_unslash($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? sanitize_text_field(wp_unslash($_POST['phone'])) : '';
    $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : '';
    $company = isset($_POST['company']) ? sanitize_text_field(wp_unslash($_POST['company'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash($_POST['message'])) : '';
    $email_recepient = isset($_POST['email_recepient']) ? sanitize_email(wp_unslash($_POST['email_recepient'])) : '';

    if (!$name || !$phone || !$email || !$company) {
        wp_send_json_error(array('message' => 'Please fill in all required fields.'));
    }

    if (!is_email($email)) {
        wp_send_json_error(array('message' => 'Please enter a valid email address.'));
    }

    if ($email_recepient && !is_email($email_recepient)) {
        $email_recepient = '';
    }

    $post_id = wp_insert_post(array(
        'post_type' => 'brochure_form',
        'post_title' => $name,
        'post_status' => 'publish',
        'post_content' => $message,
    ), true);

    if (is_wp_error($post_id)) {
        wp_send_json_error(array('message' => 'Submit failed. Please try again.'));
    }

    update_post_meta($post_id, 'name', $name);
    update_post_meta($post_id, 'phone', $phone);
    update_post_meta($post_id, 'email', $email);
    update_post_meta($post_id, 'company', $company);
    update_post_meta($post_id, 'message', $message);
    update_post_meta($post_id, 'email_recepient', $email_recepient);

    wp_send_json_success(array('message' => 'Submit form successfully.'));
}

add_action('wp_ajax_brochure_form', 'ifc_hanoi_submit_brochure_form');
add_action('wp_ajax_nopriv_brochure_form', 'ifc_hanoi_submit_brochure_form');
