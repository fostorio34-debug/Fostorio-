const fs = require('fs');

const path = 'src/components/Navigation.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { cart, user, logout, wishlist, darkMode, toggleDarkMode } = useStore();",
  "const { cart, user, wishlist, darkMode, toggleDarkMode } = useStore();\n  const handleLogout = async () => {\n    try {\n      const { signOut } = await import('firebase/auth');\n      const { auth } = await import('../lib/firebase');\n      await signOut(auth);\n    } catch (err) {\n      console.error(err);\n    }\n  };"
);

content = content.replace("onClick={logout}", "onClick={handleLogout}");
content = content.replace("logout(); setIsMobileMenuOpen(false);", "handleLogout(); setIsMobileMenuOpen(false);");

fs.writeFileSync(path, content);
console.log('Done Navigation');

const profilePath = 'src/pages/Profile.tsx';
let profileContent = fs.readFileSync(profilePath, 'utf8');
profileContent = profileContent.replace(
  "const { user, logout, orders } = useStore();",
  "const { user, orders } = useStore();\n  const handleLogout = async () => {\n    try {\n      const { signOut } = await import('firebase/auth');\n      const { auth } = await import('../lib/firebase');\n      await signOut(auth);\n    } catch (err) {\n      console.error(err);\n    }\n  };"
);
profileContent = profileContent.replace("onClick={logout}", "onClick={handleLogout}");
fs.writeFileSync(profilePath, profileContent);
console.log('Done Profile');

