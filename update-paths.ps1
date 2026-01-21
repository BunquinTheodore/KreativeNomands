# PowerShell script to update portfolio.json paths

$portfolioFile = "C:\Kreative Nomads\kreativ-nomads-website\src\data\portfolio.json"
$content = Get-Content $portfolioFile -Raw

# Directory path replacements (in order of most specific to least specific to avoid partial replacements)
$replacements = @(
    @{Old = '/portfolio/Events/Baker & Mckenzie Global Services Manila/Virtual Event Assets/'; New = '/portfolio/Events/baker-mckenzie/virtual-event-assets/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/Carousel - Driving Trial Mechanics/'; New = '/portfolio/fnb/monza/Events/Carousel---Driving-Trial-Mechanics/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/Carousel - Monza Eastwood Event/'; New = '/portfolio/fnb/monza/Events/Carousel---Monza-Eastwood-Event/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/Carousel - Winners Mapua/'; New = '/portfolio/fnb/monza/Events/Carousel---Winners-Mapua/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/Carousel Estancia Roadshow/'; New = '/portfolio/fnb/monza/Events/Carousel-Estancia-Roadshow/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/Graphic Design/'; New = '/portfolio/fnb/monza/Events/Graphic-Design/'},
    @{Old = '/portfolio/F&B (Restaurant)/Monza Barcade/Events/'; New = '/portfolio/fnb/monza/Events/'},
    @{Old = '/portfolio/F&B (Restaurant)/MSME/Branding, Graphic Design & Photography/'; New = '/portfolio/fnb/msme/Branding-Graphic-Design-Photography/'},
    @{Old = '/portfolio/F&B (Restaurant)/MSME/Carousel/Carousel 1/'; New = '/portfolio/fnb/msme/Carousel/Carousel-1/'},
    @{Old = '/portfolio/Health & Fitness/Xendurance Samples/Ads/Deep Sleep Promo/'; New = '/portfolio/health-fitness/xendurance/ads/deep-sleep/'},
    @{Old = '/portfolio/Health & Fitness/Xendurance Samples/Ads/Pack Promo/'; New = '/portfolio/health-fitness/xendurance/ads/packs/'},
    @{Old = '/portfolio/Health & Fitness/Xendurance Samples/Ads/Probiotic + Prebiotic Promo/'; New = '/portfolio/health-fitness/xendurance/ads/probiotic/'},
    @{Old = '/portfolio/Health & Fitness/Xendurance Samples/Lifestyle Inspirational Content/'; New = '/portfolio/health-fitness/xendurance/Lifestyle-Inspirational-Content/'},
    @{Old = '/portfolio/Health & Fitness/Xendurance Samples/Testimonials/'; New = '/portfolio/health-fitness/xendurance/Testimonials/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 1/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-1/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 2/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-2/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 3/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-3/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 4/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-4/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 5/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-5/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 6/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-6/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 7/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-7/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 8/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-8/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/Carousel 9/'; New = '/portfolio/Insurance/sunlife/graphics/Carousel-9/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Graphic Design/'; New = '/portfolio/Insurance/sunlife/graphics/'},
    @{Old = '/portfolio/Insurance/Sunlife Grepa Financial Inc/Video Content/'; New = '/portfolio/Insurance/sunlife/videos/'},
    @{Old = '/portfolio/Real Estate/Twin Oaks Real Estate/Photo Edits/'; New = '/portfolio/real-estate/twin-oaks/photos/'},
    @{Old = '/portfolio/Real Estate/Twin Oaks Real Estate/Video Edits/'; New = '/portfolio/real-estate/twin-oaks/videos/'}
)

# Apply directory replacements
foreach ($replacement in $replacements) {
    $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
}

# Replace spaces in filenames with underscores
$content = $content -replace '([a-zA-Z0-9])( )([a-zA-Z0-9])', '$1_$2$3'
$content = $content -replace '([a-zA-Z0-9])( )([a-zA-Z0-9])', '$1_$2$3'  # Run twice for overlapping matches
$content = $content -replace '([a-zA-Z0-9])( )([a-zA-Z0-9])', '$1_$2$3'  # Run three times for overlapping matches
$content = $content -replace '([a-zA-Z0-9])( )([a-zA-Z0-9])', '$1_$2$3'  # Run four times for overlapping matches
$content = $content -replace '([a-zA-Z0-9])( )([a-zA-Z0-9])', '$1_$2$3'  # Run five times for overlapping matches

# More aggressive space to underscore replacement in file paths
$content = $content -replace '(\.mp4|\.jpg|\.png)(["\s])', '$1$2' | ForEach-Object {
    $_ -replace '("\/portfolio\/[^"]+)"', {
        param($match)
        $match.Value -replace ' ', '_'
    }
}

# Save the updated content
$content | Set-Content $portfolioFile -Encoding UTF8

Write-Host "Portfolio paths updated successfully!" -ForegroundColor Green
