import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class UploadResumeScreen extends StatefulWidget {
  const UploadResumeScreen({super.key});

  @override
  State<UploadResumeScreen> createState() => _UploadResumeScreenState();
}

class _UploadResumeScreenState extends State<UploadResumeScreen> {
  bool uploading = false;
  String? url;

  Future<void> pickAndUpload() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf','docx']);
    if (result == null) return;
    final file = File(result.files.single.path!);
    setState(()=> uploading = true);
    try{
      final token = await const FlutterSecureStorage().read(key: 'token');
      final req = http.MultipartRequest('POST', Uri.parse('http://localhost:5000/api/resumes/upload'));
      req.headers['Authorization'] = 'Bearer $token';
      req.files.add(await http.MultipartFile.fromPath('file', file.path));
      final resp = await req.send();
      final data = jsonDecode(await resp.stream.bytesToString());
      setState(()=> url = data['fileUrl']);
    } finally { setState(()=> uploading = false); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload Resume')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ElevatedButton(onPressed: uploading? null : pickAndUpload, child: Text(uploading? 'Uploading...' : 'Pick & Upload')),
          if (url != null) Text('Uploaded: $url')
        ]),
      ),
    );
  }
}
