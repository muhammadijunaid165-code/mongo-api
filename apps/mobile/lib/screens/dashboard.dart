import 'package:flutter/material.dart';
import 'upload_resume.dart';
import 'interview.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Candidate Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ElevatedButton(onPressed: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (_)=> const UploadResumeScreen())), child: const Text('Upload Resume')),
          const SizedBox(height: 12),
          ElevatedButton(onPressed: ()=> Navigator.of(context).push(MaterialPageRoute(builder: (_)=> const InterviewScreen())), child: const Text('Start Interview')),
        ]),
      ),
    );
  }
}
