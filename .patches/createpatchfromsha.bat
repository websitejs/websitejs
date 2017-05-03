setlocal enabledelayedexpansion
set output=
for /f %%G in ('git diff-tree --no-commit-id --name-only -r %2^^ %1') do ( set output=!output! "%%G" )
git archive -o ./patch-%1.zip %1 %output%
endlocal
