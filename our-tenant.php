<?php
/* Our Tenants template - data source: ACF field tenants_floors. */
$raw_floors = ifc_hanoi_get_field('tenants_floors');
$floors = array();

if (is_array($raw_floors)) {
    foreach ($raw_floors as $floor_index => $floor) {
        $floor_key = sanitize_key($floor['floor_key'] ?? '');
        $floor_key = $floor_key ?: 'floor-' . ($floor_index + 1);
        $floor_label = trim((string) ($floor['floor_label'] ?? ''));
        $floor_label = $floor_label ?: strtoupper($floor_key);
        $floor_plan = !empty($floor['floorplan'])
            ? ifc_hanoi_get_image_url($floor['floorplan'], 'full')
            : '';
        $tenants = array();

        $raw_tenants = $floor['tenants'] ?? array();
        if (is_array($raw_tenants)) {
            foreach ($raw_tenants as $tenant_index => $tenant) {
                $tenant_name = trim((string) ($tenant['tenant_name'] ?? ''));
                if (!$tenant_name) continue;

                $meta = array();
                $raw_meta = $tenant['tenant_meta'] ?? array();
                if (is_array($raw_meta)) {
                    foreach ($raw_meta as $row) {
                        $label = trim((string) ($row['label'] ?? ''));
                        $value = trim((string) ($row['value'] ?? ''));
                        if ($label || $value) {
                            $value = preg_replace(
                                '/<a\b(?![^>]*\bstaggertext\b)([^>]*)>/i',
                                '<a$1 staggertext data-meta-stagger>',
                                $value
                            );
                            $meta[] = array(
                                'label' => $label,
                                'value' => $value,
                            );
                        }
                    }
                }

                $media = array();
                $raw_media = $tenant['tenant_media'] ?? array();
                if (is_array($raw_media)) {
                    foreach ($raw_media as $image) {
                        $url = ifc_hanoi_get_image_url($image, 'full');
                        if ($url) $media[] = esc_url($url);
                    }
                }

                $tenants[] = array(
                    'id' => $floor_key . '-' . sanitize_title($tenant_name) . '-' . ($tenant_index + 1),
                    'name' => $tenant_name,
                    'logo' => ifc_hanoi_get_image_url($tenant['tenant_logo'] ?? '', 'full'),
                    'meta' => $meta,
                    'description' => wp_kses_post($tenant['tenant_description'] ?? ''),
                    'media' => $media,
                );
            }
        }

        if ($tenants) {
            $floors[] = array(
                'key' => $floor_key,
                'label' => $floor_label,
                'plan' => $floor_plan,
                'tenants' => $tenants,
            );
        }
    }
}

$first_floor = $floors[0] ?? array(
    'key' => 'b1f',
    'label' => 'B1F',
    'plan' => '',
    'tenants' => array(),
);
?>

<section class="ourTenant" aria-labelledby="our-tenant-heading">
    <div class="ourTenant__inner">
        <h2 id="our-tenant-heading" class="visually-hidden">Our Tenants</h2>

        <div id="tenant-floor-select" class="ourTenant__floor-select dropdown-custom-select" data-floor-select>
            <span class="visually-hidden">Select a floor</span>
            <button class="dropdown-custom-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
                <span class="dropdown-custom-text"><?php echo esc_html($first_floor['label']); ?></span>
                <span class="icon" aria-hidden="true">
                    <svg viewBox="0 0 12 8"><path d="m1 1 5 5 5-5" /></svg>
                </span>
            </button>
            <div class="dropdown-custom-menu" role="listbox">
                <?php foreach ($floors as $index => $floor): ?>
                    <div class="dropdown-custom-item<?php echo $index === 0 ? ' active' : ''; ?>" role="option" aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>" data-floor-option="<?php echo esc_attr($floor['key']); ?>">
                        <?php echo esc_html($floor['label']); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="ourTenant__floor-tabs" role="tablist" aria-label="Select a floor">
            <?php foreach ($floors as $index => $floor): ?>
                <button class="ourTenant__floor-tab<?php echo $index === 0 ? ' active' : ''; ?>" type="button" role="tab" aria-selected="<?php echo $index === 0 ? 'true' : 'false'; ?>" data-floor-tab data-floor="<?php echo esc_attr($floor['key']); ?>" data-plan="<?php echo esc_url($floor['plan']); ?>">
                    <?php echo esc_html($floor['label']); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="ourTenant__overview">
            <div class="ourTenant__tenant-list" role="tablist" aria-label="Select a tenant" data-tenant-list>
                <?php foreach ($floors as $floor_index => $floor): ?>
                    <?php foreach ($floor['tenants'] as $tenant_index => $tenant): ?>
                        <button class="ourTenant__tenant-card<?php echo $floor_index === 0 && $tenant_index === 0 ? ' active' : ''; ?>" type="button" role="tab" aria-selected="<?php echo $floor_index === 0 && $tenant_index === 0 ? 'true' : 'false'; ?>" data-floor="<?php echo esc_attr($floor['key']); ?>" data-tenant="<?php echo esc_attr($tenant['id']); ?>">
                            <?php if ($tenant['logo']): ?>
                                <img class="ourTenant__tenant-logo-image" src="<?php echo esc_url($tenant['logo']); ?>" alt="<?php echo esc_attr($tenant['name']); ?>" />
                            <?php else: ?>
                                <span class="ourTenant__tenant-logo"><?php echo esc_html($tenant['name']); ?></span>
                            <?php endif; ?>
                        </button>
                    <?php endforeach; ?>
                <?php endforeach; ?>
            </div>

            <div class="ourTenant__right-column">
                <div class="ourTenant__plan" aria-live="polite"<?php echo empty($first_floor['plan']) ? ' hidden' : ''; ?> >
                    <img class="ourTenant__plan-image" src="<?php echo esc_url($first_floor['plan']); ?>" alt="<?php echo esc_attr($first_floor['label']); ?> floor plan" data-floor-plan />
                </div>

                <div class="ourTenant__detail" aria-live="polite" data-tenant-detail>
                    <?php foreach ($floors as $floor_index => $floor): ?>
                        <?php foreach ($floor['tenants'] as $tenant_index => $tenant): ?>
                            <div class="ourTenant__article" data-tenant-content="<?php echo esc_attr($tenant['id']); ?>"<?php echo $floor_index === 0 && $tenant_index === 0 ? '' : ' hidden'; ?>>
                                <div class="ourTenant__article-head">
                                    <h3 class="ourTenant__title"><?php echo esc_html($tenant['name']); ?></h3>
                                    <dl class="ourTenant__meta">
                                        <?php foreach ($tenant['meta'] as $row): ?>
                                            <div>
                                                <dt><?php echo esc_html($row['label']); ?></dt>
                                                <dd><?php echo $row['value']; ?></dd>
                                            </div>
                                        <?php endforeach; ?>
                                    </dl>
                                </div>

                                <div class="ourTenant__copy ourTenant__editor-content">
                                    <?php echo $tenant['description']; ?>
                                </div>

                                <?php if (!empty($tenant['media'])): ?>
                                    <div class="ourTenant__media<?php echo count($tenant['media']) < 2 ? ' is-single' : ''; ?>">
                                        <div class="swiper ourTenant__media-slider">
                                            <div class="swiper-wrapper">
                                                <?php foreach ($tenant['media'] as $image): ?>
                                                    <div class="swiper-slide">
                                                        <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($tenant['name']); ?>" />
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                        </div>

                                        <?php if (count($tenant['media']) > 1): ?>
                                            <div class="ourTenant__media-nav">
                                                <button class="ourTenant__media-prev" type="button" aria-label="Previous image">
                                                    <img src="<?php echo esc_url(get_theme_file_uri('/assets/images/icons/icon-arrow-secondary.svg')); ?>" alt="" />
                                                </button>
                                                <button class="ourTenant__media-next" type="button" aria-label="Next image">
                                                    <img src="<?php echo esc_url(get_theme_file_uri('/assets/images/icons/icon-arrow-secondary.svg')); ?>" alt="" />
                                                </button>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</section>
