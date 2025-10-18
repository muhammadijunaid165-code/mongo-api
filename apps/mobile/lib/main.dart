import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_windowmanager/flutter_windowmanager.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'screens/login.dart';
import 'screens/dashboard.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE);
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Recruit',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FutureBuilder(
        future: const FlutterSecureStorage().read(key: 'token'),
        builder: (context, snap) {
          if (!snap.hasData) return const LoginScreen();
          return const DashboardScreen();
        },
      ),
    );
  }
}
