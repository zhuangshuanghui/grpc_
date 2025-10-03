const fs = require('fs');
const { execSync } = require('child_process');

// Step 1: Generate .js from .proto
fs.readdirSync('./proto').forEach(f => {
  if (f.endsWith('.proto')) {
    const name = f.replace('.proto', '');
    execSync(`npx pbjs -t static-module -w commonjs -o ./gen/${name}_pb.js ./proto/${f}`);
  }
});

// Step 2: Generate .d.ts from .js
fs.readdirSync('./gen').forEach(f => {
  if (f.endsWith('_pb.js')) {
    const name = f.replace('_pb.js', '');
    execSync(`npx pbts -o ./gen/${name}_pb.d.ts ./gen/${f}`);
  }
});


//生成到客户端
fs.readdirSync('./proto').forEach(f => {
  if (f.endsWith('.proto')) {
    const name = f.replace('.proto', '');
    execSync(`npx pbjs -t static-module -w commonjs -o ./../Tarnished_zsh/assets/script/core/3rd/gen/${name}_pb.js ./proto/${f}`);
  }
});
fs.readdirSync('./gen').forEach(f => {
  if (f.endsWith('_pb.js')) {
    const name = f.replace('_pb.js', '');
    execSync(`npx pbts -o ./../Tarnished_zsh/assets/script/core/3rd/gen/${name}_pb.d.ts ./gen/${f}`);
  }
});

//生成到客户端
fs.readdirSync('./proto').forEach(f => {
  if (f.endsWith('.proto')) {
    const name = f.replace('.proto', '');
    execSync(`npx pbjs -t static-module -w commonjs -o ./../server/gen/${name}_pb.js ./proto/${f}`);
  }
});
fs.readdirSync('./gen').forEach(f => {
  if (f.endsWith('_pb.js')) {
    const name = f.replace('_pb.js', '');
    execSync(`npx pbts -o ./../server/gen/${name}_pb.d.ts ./gen/${f}`);
  }
});