import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dashboard.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  bool loading = false;

  Future<void> login() async {
    setState(() => loading = true);
    try{
      final resp = await http.post(Uri.parse('http://localhost:5000/api/auth/login'),
        headers: {'Content-Type':'application/json'},
        body: jsonEncode({'email': email.text, 'password': password.text})
      );
      final data = jsonDecode(resp.body);
      await const FlutterSecureStorage().write(key: 'token', value: data['accessToken']);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_)=>const DashboardScreen()));
    } finally {
      setState(()=> loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 360,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: const [BoxShadow(blurRadius: 8, color: Colors.black12)]),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Text('Login', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            TextField(controller: email, decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Email')),
            const SizedBox(height: 8),
            TextField(controller: password, obscureText: true, decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Password')),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: loading? null : login, child: Text(loading? '...' : 'Login'))
          ]),
        ),
      ),
    );
  }
}
