
$ErrorActionPreference = 'Stop'
$images = @(
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_01.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_02.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_03.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_04.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_05.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_06.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_07.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_08.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_09.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_10.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_11.png',
  'C:\Users\i\Documents\New project\pitch-assets\abyssrium-desk-dark-merged\slide_12.png'
)
$out = 'C:\Users\i\Downloads\Abyssrium_Desk_dark_merged_report.pptx'
if (Test-Path -LiteralPath $out) {
  Remove-Item -LiteralPath $out -Force
}
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = 1
$pres = $ppt.Presentations.Add()
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540
foreach ($img in $images) {
  $slide = $pres.Slides.Add($pres.Slides.Count + 1, 12)
  $slide.Shapes.AddPicture($img, 0, -1, 0, 0, 960, 540) | Out-Null
}
$pres.SaveAs($out, 24)
$pres.Close()
$verify = $ppt.Presentations.Open($out, 0, 0, 0)
$count = $verify.Slides.Count
$verify.Close()
$ppt.Quit()
[GC]::Collect()
[GC]::WaitForPendingFinalizers()
Write-Output "SlideCount=$count"
