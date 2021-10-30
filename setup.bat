@REM echo "cd"
@REM E:
@REM cd E:\HoDoan\nest\test
@REM echo "npm run"
@REM npm run start:dev & npm install
@REM PAUSE

call cd /d E:\HoDoan\nest\test & npm run start:dev
call cd /d E:\HoDoan\nest\test\client & react-scripts start
@REM call cd /d E:\HoDoan\nest\FE & npm run start:dev